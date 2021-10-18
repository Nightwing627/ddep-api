'use strict';

const ftp = require('basic-ftp');
const fs = require('fs');

class FTPClient {
    constructor(host = 'localhost', port = 21, username = 'anonymous', password = 'guest', secure = false) {
        this.client = new ftp.Client();
        this.settings = {
            host: host,
            port: port,
            user: username,
            password: password,
            secure: secure
        };
    }

    upload(sourcePath, remotePath, permissions) {
        let self = this;
        (async () => {
            try {
                let access = await self.client.access(self.settings);
                let upload = await self.client.upload(fs.createReadStream(sourcePath), remotePath);
                let permissions = await self.changePermissions(permissions.toString(), remotePath);
            } catch(err) {
                console.log(err);
            }
            self.client.close();
        })();
    }

    close() {
        this.client.close();
    }
    changePermissions(perms, filepath) {
        let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
        return this.client.send(cmd, false);
    }
    trackProgress(){
        this.client.trackProgress(info => {
            console.log("File", info.name)
            console.log("Type", info.type)
            console.log("Transferred", info.bytes)
            console.log("Transferred Overall", info.bytesOverall)
        })
    }
}

module.exports = FTPClient;