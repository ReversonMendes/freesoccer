import * as request from 'request-promise-any';
import * as cheerio from 'cheerio';
import * as md5 from 'md5';
import * as moment from 'moment';

import RfefConstants from '../constants/RfefConstants';
import Helpers from '../utils/Helpers';
import ICompetitionDefault from '../interfaces/ICompetitionDefault';

import { ICompetition } from '../schemas/Competition';
import { Round, IRound } from '../schemas/Round';
import Match from '../schemas/Match';
import TeamResult from '../schemas/TeamResult';

export default class RfefLeagueScraping {
    public lastYear: boolean;

    constructor(lastYear: boolean) {
        this.lastYear = lastYear;    
    }

    public async run(competition: ICompetitionDefault) {
        console.log("-> RFEF LEAGUE SCRAPING");

        await this.runCompetition(competition)
    }

    public async runCompetition(competitionDefault:ICompetitionDefault) {
        console.log("\t-> "+competitionDefault.name);

        let initial = 0;
        if(this.lastYear) initial = competitionDefault.years!.length-1; 

        for(let i = initial ; i < competitionDefault.years!.length; i++) {
            console.log("\t\t-> "+competitionDefault.years![i]);

            let year = (parseInt(competitionDefault.years![i])-1).toString();

            let competition = await Helpers.createCompetition(competitionDefault,year,RfefConstants);
            
            let page = await request(RfefConstants.URL_DEFAULT+competitionDefault.aux.url+"/resultados?t="+competitionDefault.years![i]);

            let $ = cheerio.load(page);
            let list = $(".postcontent").find(".content").children(".container-fluid");

            for(let j = 0; j < list.length; j++){
                if(list.eq(j).children("div").children().eq(0).text().trim().includes(competitionDefault.aux.name)){
                    let rounds = list.eq(j).children("div").children().eq(1).children("div").children("ul").children();
            
                    for(let k = 0; k < rounds.length; k++){
                        let roundResult = await this.runRound(rounds.eq(k),competition,competitionDefault.aux.url);
                        competition.rounds.push(roundResult!._id);
                    }
                    
                    break;
                }
            }

            await Helpers.replaceCompetition(competition);
        }
    }
    
    public async runRound(roundHtml:any, competition:ICompetition, url:String): Promise<IRound | null> {
        let route = roundHtml.children("a").attr("href");

        let round = new Round;
        round.goals = 0;
        round.goalsHome = 0;
        round.goalsGuest = 0;
        round.number =  roundHtml.children('a').text().split(' · ')[0].replace("Jornada ","").trim();
        round.matchs = [];
        round.competition = competition._id;
        round.hash = md5(competition.code+competition.year+round.number);
        console.log("\t\t\t-> Round "+round.number);
        
        let page = await request(RfefConstants.URL_DEFAULT+url+"/"+route);

        let $ = cheerio.load(page);
        let data = $(".postcontent").find(".content").children("div");
        let matchs = data.children(".view-content").children("table").children("tbody").children();

        let date = data.children(".attachment").find(".views-field-fechaJornada").children("span").text();
        date = date.trim().replace(")","").replace("(","");
        date = moment.utc(date, 'YYYY-MM-DD').format();

        for(let i = 0; i < matchs.length; i++){
            let matchResult = await this.runMatch(matchs.eq(i),date);

            if(matchResult.teamGuest.goals && matchResult.teamHome.goals) {
                round.goals += (matchResult.teamGuest.goals + matchResult.teamHome.goals);
                round.goalsGuest += matchResult.teamGuest.goals;
                round.goalsHome += matchResult.teamHome.goals;
            }

            round.matchs.push(matchResult);
        }

        return await Helpers.replaceRound(round);
    }

    public async runMatch(matchHtml:any, date:string): Promise<Match> {
        let childrens = matchHtml.children();
        
        let match = new Match;
        match.teamHome = new TeamResult;
        match.teamGuest = new TeamResult;

        match.date = date;
        match.stadium = "";
        match.location = "";

        match.teamHome.initials = "";
        match.teamHome.name = childrens.eq(0).text().replace("SAD","").trim();
        match.teamHome.flag = "";
        match.teamHome.goals = parseInt(childrens.eq(1).text().trim());

        match.teamGuest.initials = "";
        match.teamGuest.name = childrens.eq(3).text().replace("SAD","").trim();
        match.teamGuest.flag = "";
        match.teamGuest.goals = parseInt(childrens.eq(2).text().trim());

        return match;
    }
}