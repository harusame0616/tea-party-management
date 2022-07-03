import { HttpFunction } from '@google-cloud/functions-framework';
import axios from 'axios';

const getSlackToken = () => {
  if (!process.env.SLACK_TOKEN) {
    throw new Error('SLACKトークンが未設定です。');
  }
  return process.env.SLACK_TOKEN;
};

interface SlackEventHandler {
  execute(): Promise<void>;
}

class AttendanceEventHandler implements SlackEventHandler {
  constructor(private event: any) {}

  async execute(): Promise<void> {
    const { channel, ts } = this.event.item;
    const { user: chatId } = this.event;

    const reply = await (async () => {
      try {
        return (
          await axios.get('https://slack.com/api/conversations.replies', {
            params: { channel, ts },
            headers: {
              Authorization: `Bearer ${getSlackToken()}`,
            },
          })
        ).data;
      } catch (error) {
        throw error;
      }
    })();

    const { text } = reply.messages[0];
    const [, eventDate] = text.match(/お茶会: .*\n開催日: (.*)/);
    const year = new Date(eventDate).getFullYear();
    const month = ('0' + (new Date(eventDate).getMonth() + 1)).slice(-2);
    const day = ('0' + new Date(eventDate).getDate()).slice(-2);

    const params = {
      attendance:
        this.event.type === 'reaction_added' ? 'absence' : 'attendance',
      eventDate: `${year}-${month}-${day}`,
      chatId,
    };

    await axios.put(
      process.env.TEA_PARTY_MANAGEMENT_API + '/teaparty/attendance',
      params
    );
  }
}

class SlackEventHandlerFactory {
  static create(event: any): SlackEventHandler {
    if (event.reaction === 'x' && event.type.includes('reaction')) {
      return new AttendanceEventHandler(event);
    }

    throw new Error('unknown event, ' + JSON.stringify(event));
  }
}

const getVerificationToken = () => {
  return process.env.VERIFICATION_TOKEN;
};

const handler: HttpFunction = async (req: any, res) => {
  let { token, challenge, type, event } = req.body;

  if (token !== getVerificationToken()) {
    console.error('認証エラー');
    return res.status(403).send('認証エラー');
  }

  if (type === 'url_verification') {
    return res.status(200).send({ challenge });
  }

  try {
    const SlackEventHandler = SlackEventHandlerFactory.create(event);
    await SlackEventHandler.execute();
  } catch (error) {
    console.error(typeof error === 'object' ? JSON.stringify(error) : error);
    return res.status(500).send();
  }

  return res.status(200).send();
};

export { handler };
