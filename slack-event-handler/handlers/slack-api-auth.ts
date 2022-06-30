interface SlackApiAuth {
    verifyToken: string;
}
class SlackApiAuth {
    constructor(private param: SlackApiAuth) {

    }

    execute(event:any) {
        this.param.verifyToken ===jk


    }
}