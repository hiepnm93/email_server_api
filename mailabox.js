
const FormData = require('form-data');
 
module.exports = class {
    constructor(opts = {}) {
        this.email = opts.email;
        this.password = opts.password;
        this.domain = opts.domain;
        this.b64 = (opts && opts.b64) ? opts.b64 : Buffer.from(`${this.email}:${this.password}`, 'binary').toString('base64');
    } 

    async list() {
        const res = await fetch(`https://${this.domain}/admin/mail/users?format=json`, { method: 'GET', headers: { 'Authorization': `Basic ${this.b64}`} });
        if(res.status === 200 && res.statusText === 'OK') {
            return res.json();
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }

    async addAccount(email = String, password = String) {
        const data = new FormData();
        data.append('email', email);
        data.append('password', password);

        const res = await fetch(`https://${this.domain}/admin/mail/users/add`, { method: 'POST', body: data, headers: { 'Authorization': `Basic ${this.b64}` } });
        if(res.status === 200 && res.statusText === 'OK') {
            return { status: res.status, statusText: res.status }
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }

    async removeAccount(email = String) {
        const data = new FormData();
        data.append('email', email);

        const res = await fetch(`https://${this.domain}/admin/mail/users/remove`, { method: 'POST', body: data, headers: { 'Authorization': `Basic ${this.b64}` } });
        if(res.status === 200 && res.statusText === 'OK') {
            return { status: res.status, statusText: res.status };
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }

    async listAlias() {
        const res = await fetch(`https://${this.domain}/admin/mail/aliases?format=json`, { method: 'GET', headers: { 'Authorization': `Basic ${this.b64}`} });
        if(res.status === 200 && res.statusText === 'OK') {
            return res.json();
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }

    async addAlias(from = String, to = String) {
        const data = new FormData();
        data.append('address', from); // account that gets mail
        data.append('forwards_to', to); // account that mail is forwarded to

        const res = await fetch(`https://${this.domain}/admin/mail/aliases/add`, { method: 'POST', body: data, headers: { 'Authorization': `Basic ${this.b64}` } });
        if(res.status === 200 && res.statusText === 'OK') {
            return { status: res.status, statusText: res.status };
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }     
    
    async removeAlias(alias = String) {
        const data = new FormData();
        data.append('address', alias);

        const res = await fetch(`https://${this.domain}/admin/mail/aliases/remove`, { method: 'POST', body: data, headers: { 'Authorization': `Basic ${this.b64}` } });
        if(res.status === 200 && res.statusText === 'OK') {
            return { status: res.status, statusText: res.status };
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }

    async addDNS(record = String) {
        const res = await fetch(`https://${this.domain}/admin/dns/custom/${record}`, { method: 'PUT', headers: { 'Authorization': `Basic ${this.b64}` } });
        if(res.status === 200 && res.statusText === 'OK') {
            return { status: res.status, statusText: res.status };
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }

    async removeDNS(record = String) {
        const res = await fetch(`https://${this.domain}/admin/dns/custom/${record}`, { method: 'DELETE', headers: { 'Authorization': `Basic ${this.b64}` } });
        if(res.status === 200 && res.statusText === 'OK') {
            return { status: res.status, statusText: res.status };
        } else {
            throw new Error(`Received status ${res.status}, "${res.headers.get('x-reason')}"`);
        }
    }
}