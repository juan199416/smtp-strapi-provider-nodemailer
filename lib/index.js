'use strict'

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash')
const nodemailer = require('nodemailer')

/**
 * Converts a string to a bool.
 *  - match 'true', 'on', or '1' as true.
 *  - ignore all white-space padding
 *  - ignore capitalization (case).
 **/
const toBool = val => /^\s*(true|1|on)\s*$/i.test(val);

/* eslint-disable no-unused-vars */
module.exports =  {
    provider: 'nodemailer',
    name: 'Nodemailer',
    auth: {
        nodemailer_default_from: {
            label: 'Nodemailer Default From',
            type: 'text'
        },
        nodemailer_default_replyto: {
            label: 'Nodemailer Default Reply-To',
            type: 'text'
        },
        host: {
            label: 'Host',
            type: 'text'
        },
        port: {
            label: 'Port',
            type: 'number'
        },
        user:{
            label: 'username',
            type: 'text'
        },
        password:{
            label: 'password',
            type: 'text'
        }
    },

    init: (config) => {
        let user64 = Buffer.from(config.user).toString('base64');
        let pass64 = Buffer.from(config.password).toString('base64');
    
        let transporter = nodemailer.createTransport(
            {
            host: config.host,
            port: config.port,
            auth:{
                user: config.user,
                pass: config.password
            }
        });

        return {
            send: (options) => {
                return new Promise((resolve, reject) => {
                    // Default values.
                    options = _.isObject(options) ? options : {}
                    options.from = config.nodemailer_default_from || options.from
                    options.replyTo = config.nodemailer_default_replyto || options.replyTo
                    options.text = options.text || options.html
                    options.html = options.html || options.text
                    
                    const msg = [
                        'from',
                        'to',
                        'cc',
                        'bcc',
                        'subject',
                        'text',
                        'html',
                        'attachments'
                    ]
                    transporter.verify(function(error, success) {
                        if (error) {
                             console.log(error);
                        } else {
                             console.log('Server is ready to take our messages');
                        }
                     });

                    transporter.sendMail(_.pick(options, msg))
                        .then(resolve)
                        .catch(error => reject(error))

                })
            }
        }
    }
}

