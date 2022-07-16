import { Member } from '@/domains/member/models/member';
import { TeaPartyNotificationGateway } from 'domains/tea-party/applications/tea-party-notification-gateway';
import { TeaParty } from 'domains/tea-party/models/tea-party';

export class ForTestTeaPartyNotificationGateway
  implements TeaPartyNotificationGateway
{
  isCalled = false;
  callCountOfnotifyGroups = 0;
  async notifyAttendanceConfirmation(teaParty: TeaParty): Promise<void> {
    this.isCalled = true;
  }

  async notifyGroups(teaParty: TeaParty, members: Member[]): Promise<void> {
    this.callCountOfnotifyGroups++;
  }
}
