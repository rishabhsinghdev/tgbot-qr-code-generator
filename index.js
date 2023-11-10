const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '6930068420:AAG0xcmi1Xn7eONq4RQO7wchwuC2ruy1wMg';
const quickChartApiUrl = 'https://quickchart.io/qr';

const bot = new TelegramBot(botToken, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/start') {
    sendGreetingMessage(chatId);
  } else if (msg.text.startsWith('http')) {
    generateQRCode(msg.text, chatId);
  } else {
    bot.sendMessage(chatId, 'Please send a valid link to generate QR code');
  }
});

function sendGreetingMessage(chatId) {
  const greetingMessage = 'Welcome! Click the button below to follow on Instagram:';
  const followButton = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Follow', url: 'https://www.instagram.com/rishabhdeveloper/' }],
      ],
    },
  };

  bot.sendMessage(chatId, greetingMessage, followButton)
    .then(() => setTimeout(() => sendSecondMessage(chatId), 3000))
    .catch((error) => console.error('Error sending greeting message:', error.message));
}

function sendSecondMessage(chatId) {
  const secondMessage = 'Now, send the link you want to convert into a QR code.';
  bot.sendMessage(chatId, secondMessage)
    .catch((error) => console.error('Error sending second message:', error.message));
}

function generateQRCode(link, chatId) {
  const imageUrl = `${quickChartApiUrl}?text=${encodeURIComponent(link)}`;

  bot.sendPhoto(chatId, imageUrl)
    .catch((error) => {
      console.error('Error sending QR code:', error.message);
      bot.sendMessage(chatId, 'Failed to generate QR code. Please try again later.');
    });
}
