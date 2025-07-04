import MessageType from '@soymaycol/maybailyes'
import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
import fs from "fs"

const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
    fetch(url, options)
    .then(response => response.json())
    .then(json => {
        resolve(json)
    })
    .catch((err) => {
        reject(err)
    })
})

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`📌 Ejemplo: *${usedPrefix + command}* 😎+🤑`)
    
    let [emoji, emoji2] = text.split`+`
    let anu = await fetchJson(`https://nightapi-6hbx.onrender.com/api/emojimix?emoji1=${encodeURIComponent(emoji)}&emoji2=${encodeURIComponent(emoji2)}`)

    for (let res of anu.results) {
        let userId = m.sender
        let packstickers = global.db.data.users[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker
        let texto2 = packstickers.text2 || global.packsticker2
        
        let stiker = await sticker(false, res.url, texto1, texto2)
        conn.sendFile(m.chat, stiker, null, { asSticker: true }, m)
    }
}

handler.help = ['emojimix *<emoji+emoji>*']
handler.tags = ['sticker']
handler.command = ['emojimix'] 
handler.register = true 

export default handler;
