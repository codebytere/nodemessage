const program = require("commander");
const imessage = require("./index.js");

const m = new imessage();

program
  .version("0.0.1")
  .option("-a, --getall [getall]", "Get all messages")
  .option("-k, --keyword [keyword]", "Get messages with keyword")
  .option("-m, --mrid [mrid]", "Get messages from recipient ID")
  .option("-e, --reckey [rk]", "Get messages from recipient ID with specific keyword text")
  .option("-g, --allrec [allrec]", "Get get all contact recipients")
  .option("-w, --handle [handle]", "Get recipients with handle eg.'bosco'")
  .option("-r, --ri [ri]", "Get recipient with ID")
  .option("-n, --rmi [rmi]", "Get recipient with ID and all of their messages")
  .option("-t, --top [top]", "Get top number of contacts from last n days and related info")
  .option("-d, --days [days]", "Input days")
  .option("-c, --attach [attach]", "Get all attachments")
  .option("-i, --attid [attid]", "Get attachments from recipient with ID")
  .parse(process.argv);

if (program.getall) {
  m.getAllMessages();
} else if (program.keyword) {
  m.getMessagesWithText(program.keyword);
} else if (program.mrid) {
  m.getMessagesFromID(program.mrid);
} else if (program.rk) {
  m.getMessagesFromRecipientWithID(program.mrid, program.keyword);
} else if (program.allrec) {
  m.getAllRecipients();
} else if (program.handle) {
  m.getRecipientByHandle(program.handle);
} else if (program.ri) {
  m.getRecipientByID(program.ri);
} else if (program.rmi) {
  m.getRecipientMessagesByID(program.rmi);
} else if (program.top) {
  m.getTopContacts(program.top, program.days);
} else if (program.attatch) {
  m.getAllAttachments();
} else if (program.attid) {
  m.getAttachmentsByID(program.attid);
}
