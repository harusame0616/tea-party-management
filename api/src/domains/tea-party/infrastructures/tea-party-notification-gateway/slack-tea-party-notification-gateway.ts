import { TeaPartyNotificationGateway } from 'domains/tea-party/applications/tea-party-notification-gateway';
import { TeaParty } from 'domains/tea-party/models/tea-party';
import axios from 'axios';

interface SlackTeaPartyNotificationGatewayParam {
  incommingWebHook: string;
}

export class SlackTeaPartyNotificationGateway
  implements TeaPartyNotificationGateway
{
  constructor(private param: SlackTeaPartyNotificationGatewayParam) {}

  async notifyAttendanceConfirmation(teaParty: TeaParty): Promise<void> {
    const teaPartyDto = teaParty.toDto();
    await axios.post(this.param.incommingWebHook, {
      text: `--------------------\nお茶会: ${teaPartyDto.teaPartyId}\n開催日: ${teaPartyDto.eventDate}\n\n欠席する方は❌でリアクションしてください。\n--------------------`,
    });
  }
}
