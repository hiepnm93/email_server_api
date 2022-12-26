const mailinabox = require('./mailabox');
const bodyParser = require('body-parser')
const express = require('express')
const md5 = require('md5');
const fs = require('fs');
const simpleParser = require('mailparser').simpleParser;
const app = express()
const port = 3000

const home = "/home/user-data/mail/mailboxes/"
const emailAdmin = ""
const passwdAdmin = ""
const domainBox = ""


const mail = new mailinabox({ email: emailAdmin, password: passwdAdmin, domain: domainBox });
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: true }))

const checkTime = (req, res, next) => {
    const { time, checksum } = req.body;
    const check = md5(time + 'api_key' + 'secret_key');
    if (check !== checksum) {
        res.json({ error: 'checksum not match', signal: 0 })
        return false;
    }
    next();
};

app.post('/createEmail', checkTime, async (req, res) => {
    const { email, password } = req.body;
    try {
        const createEmail = await mail.addAccount(email, password);
        res.json({
            signal: 1,
            data: createEmail
        })
    } catch (error) {
        console.log(error);
        res.json({
            signal: 0,
            error: error
        })
    }
});
app.post('/listEmail', checkTime, async (req, res) => {
    try {
        const listEmail = await mail.list();
        res.json({
            signal: 1,
            data: listEmail
        })

    } catch (error) {
        console.log(error);
        res.json({
            signal: 0,
            error: error
        })
    }
})
app.post('/delEmail', checkTime, async (req, res) => {
    const { email } = req.body;
    try {
        const createEmail = await mail.removeAccount(email)
        res.json({
            signal: 1,
            data: createEmail
        })
    } catch (error) {
        console.log(error);
        res.json({
            signal: 0,
            error: error
        })
    }

});

app.post('/getEmail', checkTime, async (req, res) => {
    const { email, type } = req.body;
    try {
        const splitEmail = email.split('@');
        const domain = splitEmail[1];
        const username = splitEmail[0];

        const folderNew = `${home}/${username}/${type}/`;

        const listFile = fs.readdirSync(folderNew);
        const listEmail = [];
        listFile.forEach(file => {
            listEmail.push(
                {
                    fileName: folderNew + file,
                }
            )
        });
        var listPromise = []
        listEmail.forEach(async (item,index) => {
            var fd = fs.readFileSync(item.fileName, 'utf8');
            listPromise.push(simpleParser(fd))
        })

        var returnPromise = await Promise.all(listPromise);
        returnPromise.forEach((data, index) =>{
            listEmail[index].data = data;
        })

        res.json({
            signal: 1,
            data: listEmail
        })
    } catch (error) {
        console.log(error);
        res.json({
            signal: 0,
            error: error
        })
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})