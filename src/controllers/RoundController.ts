import { Response, Request } from "express";

import { Competition } from "../schemas/Competition";
import { Round } from "../schemas/Round";
import Helpers from "../utils/Helpers";

export default class RoundController {
    public async all(req: Request, res: Response) {
        try {
            let competition = await Competition.findOne({"code":req.params.competition,"year":req.params.year});

            if (competition==null) {
                throw new Error("Competition does not exist")
            } else {
                console.log(competition._id);
                let rounds = await Round.aggregate([
                    {
                        $match: {"competition":competition._id},
                    },
                    { 
                        $project : {
                            _id : 0,
                            number: 1,
                            goals: 1,
                            goalsHome: 1,
                            goalsGuest: 1,
                            url: {$concat:[Helpers.getUrl(req, req.url),"/","$number"]},
                            matches: { $size: "$matchs" }
                        }
                    }
                ])

                res.send({ rounds });
            }
        } catch (error) {
            console.log(error);
            res.status(404).send({error:true});
        }
    }
}