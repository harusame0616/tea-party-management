import { TeaParty } from '../models/tea-party';

export interface TeaPartyNotificationGateway {
  notifyAttendanceConfirmation(teaParty: TeaParty): Promise<void>;
}
