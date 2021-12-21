'use strict';

var Client = require('ftp');
const fs = require('fs');

class FTP {
    constructor(host = 'localhost', port = 21, username = 'anonymous', password = 'guest', secure = false) {
        this.client = new Client.Client();
        this.c =this.client.connect({
            host: host,
            user: username,
            password: password,
            port:port,
            secure :secure 
        })
        // this.settings = {
        //     host: host,
        //     port: port,
        //     user: username,
        //     password: password,
        //     secure: secure
        // };
        console.log("ftp connected");
    }

    getfile(sourcePath, remotePath, permissions1) {
        let self = this;
        var content = '';
        self.c.on('ready', function() {
            c.get(sourcePath, function(err, stream) {
                 
                 stream.on('data', function(chunk) {
                     content += chunk.toString();
                 });
                 stream.on('end', function() {
                     // content variable now contains all file content. 
                 });
                 console.log(content);
            })
        });
        
    }
    download(remotePath,localPath){
        let self = this;
        (async () => {
            try {
                let access = await self.client.access(self.settings);
               let download = await self.client.downloadTo(localPath, remotePath);
            }catch(err)
            {
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

module.exports = FTP;