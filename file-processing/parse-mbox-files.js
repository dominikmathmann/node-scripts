const Mbox = require('node-mbox');
const simpleParser = require('mailparser').simpleParser;

const mbox = new Mbox('mails.mbox', {});

const mailsFrom = new Map();

mbox.on('message', function(msg) {
  simpleParser(msg.toString(), (err, mail) => {
    const adr = mail.from.value[0].address;
    if (!mailsFrom.has(adr)) {
      mailsFrom.set(adr, { s: '', c: 0 });
    }
    let current = mailsFrom.get(adr);
    current.c++;
    current.s = current.s + ' -- ' + mail.subject;
    mailsFrom.set(adr, current);
    // console.log(`${mail.from.value[0].address} (${mail.from.value[0].name})`);
    // console.log(mail.subject);
    // console.log(mail.date);
    // console.log('---');
  });
});

mbox.on('error', function(err) {
  console.log('got an error', err);
});

mbox.on('end', function() {
  mailsFrom.forEach((value, key) => {
    console.log(key + ';' + value.s + ';' + value.c);
  });
});
