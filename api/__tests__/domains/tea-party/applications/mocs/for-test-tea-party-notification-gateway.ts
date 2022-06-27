import { TeaPartyNotificationGateway } from 'domains/tea-party/applications/tea-party-notification-gateway';
import { TeaParty } from 'domains/tea-party/models/tea-party';

export class ForTestTeaPartyNotificationGateway
  implements TeaPartyNotificationGateway
{
  isCalled = false;
  async notifyAttendanceConfirmation(teaParty: TeaParty): Promise<void> {
    this.isCalled = true;
  }
}
