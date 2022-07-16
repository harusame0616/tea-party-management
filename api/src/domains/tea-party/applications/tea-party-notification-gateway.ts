import { Member } from '@/domains/member/models/member';
import { TeaParty } from '../models/tea-party';

export interface TeaPartyNotificationGateway {
  notifyAttendanceConfirmation(teaParty: TeaParty): Promise<void>;
  notifyGroups(teaParty: TeaParty, members: Member[]): Promise<void>;
}
