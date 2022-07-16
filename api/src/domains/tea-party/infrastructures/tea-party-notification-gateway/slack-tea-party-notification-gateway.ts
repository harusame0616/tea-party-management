import { Member } from '@/domains/member/models/member';
import axios from 'axios';
import { TeaPartyNotificationGateway } from 'domains/tea-party/applications/tea-party-notification-gateway';
import { TeaParty } from 'domains/tea-party/models/tea-party';

interface SlackTeaPartyNotificationGatewayParam {
  incommingWebHook: string;
}

export class SlackTeaPartyNotificationGateway
  implements TeaPartyNotificationGateway
{
  constructor(private param: SlackTeaPartyNotificationGatewayParam) {}
  async notifyGroups(teaParty: TeaParty, members: Member[]): Promise<void> {
    const teaPartyDto = teaParty.toDto();
    const memberIdMap = Object.fromEntries(
      members.map((member) => [member.memberId.memberId, member])
    );

    await axios.post(this.param.incommingWebHook, {
      text: `お茶会のグループが決定しました。\n\nお茶会: ${
        teaPartyDto.teaPartyId
      }\n開催日: ${teaPartyDto.eventDate}\n\n${teaPartyDto.groups
        .map(
          (group, index) =>
            `-- グループ${index} ----------\n` +
            group.memberIds
              .map((memberId) => memberIdMap[memberId].name)
              .join('\n')
        )
        .join('\n\n')}`,
    });
  }

  async notifyAttendanceConfirmation(teaParty: TeaParty): Promise<void> {
    const teaPartyDto = teaParty.toDto();
    await axios.post(this.param.incommingWebHook, {
      text: `--------------------\nお茶会: ${teaPartyDto.teaPartyId}\n開催日: ${teaPartyDto.eventDate}\n\n欠席する方は❌でリアクションしてください。\n--------------------`,
    });
  }
}
