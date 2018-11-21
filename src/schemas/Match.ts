import TeamResult from './TeamResult';

export default class Match {
    public name: string = "";
    public date: string = "";
    public stadium: string = "";
    public location: string = "";
    public teamHome: TeamResult = new TeamResult;
    public teamGuest: TeamResult = new TeamResult;
}