const fs = require('fs');
const axios = require('axios');

const maxThreshold = 10000;
const ranks = [
  { threshold: Math.round(maxThreshold * (2000 / 2000)), title: '★' },
  { threshold: Math.round(maxThreshold * (1800 / 2000)), title: 'god 🌟' },
  { threshold: Math.round(maxThreshold * (1700 / 2000)), title: 'legend 🏆' },
  { threshold: Math.round(maxThreshold * (1600 / 2000)), title: 'hero 🦸‍♂️' },
  { threshold: Math.round(maxThreshold * (1500 / 2000)), title: 'champion 🥇' },
  { threshold: Math.round(maxThreshold * (1400 / 2000)), title: 'demon king 👹' },
  { threshold: Math.round(maxThreshold * (1300 / 2000)), title: 'warlord ⚔️' },
  { threshold: Math.round(maxThreshold * (1200 / 2000)), title: 'devil 😈' },
  { threshold: Math.round(maxThreshold * (1100 / 2000)), title: 'sorcerer 🔮' },
  { threshold: Math.round(maxThreshold * (1000 / 2000)), title: 'king 👑' },
  { threshold: Math.round(maxThreshold * (900 / 2000)), title: 'noble 🎩' },
  { threshold: Math.round(maxThreshold * (800 / 2000)), title: 'prince 🤴' },
  { threshold: Math.round(maxThreshold * (700 / 2000)), title: 'duke 🎖️' },
  { threshold: Math.round(maxThreshold * (600 / 2000)), title: 'knight 🛡️' },
  { threshold: Math.round(maxThreshold * (500 / 2000)), title: 'viking 🪓' },
  { threshold: Math.round(maxThreshold * (400 / 2000)), title: 'wizard 🧙‍♂️' },
  { threshold: Math.round(maxThreshold * (300 / 2000)), title: 'rogue 🗡️' },
  { threshold: Math.round(maxThreshold * (200 / 2000)), title: 'archer 🏹' },
  { threshold: Math.round(maxThreshold * (100 / 2000)), title: 'squire 🛠️' },
  { threshold: 0, title: 'commoners 👥' },
];

const generateMathProblems = () => {
  const operations = ['×', '+', '-', '÷'];
  const problems = [];

  for (let i = 0; i < 10; i++) {
    const num1 = Math.floor(Math.random() * 999) + 1;
    const num2 = Math.floor(Math.random() * 999) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer;
    switch (operation) {
      case '×':
        answer = num1 * num2;
        break;
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '÷':
        answer = num1 / num2;
        break;
      default:
        answer = null;
    }

    problems.push({
      type: operation,
      soal: `${num1} ${operation} ${num2} =`,
      jawaban: answer.toString()
    });
  }

  return problems;
};

const getRankTitle = (points) => {
  const rank = ranks.find(rank => points >= rank.threshold);
  return rank ? rank.title : 'unknown 🤷‍♂️';
};

const getNextRankPoints = (points) => {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (points < ranks[i].threshold) {
      return ranks[i].threshold - points;
    }
  }
  return 0;
};

const skor = (username) => {
  const pointData = JSON.parse(fs.readFileSync('./DB/point.json'));
  const points = pointData[username] || 0;
  const rankTitle = getRankTitle(points);
  const pointsToNextRank = getNextRankPoints(points);
  const nextRankTitle = getRankTitle(points + pointsToNextRank);
  
  return `*Point :* ${points}\n*Status:* ${rankTitle}\n> butuh ${pointsToNextRank} point untuk mencapai rank ${nextRankTitle}`;
};

const topskor = (username) => {
  const pointData = JSON.parse(fs.readFileSync('./DB/point.json'));
  const sortedPoints = Object.entries(pointData).sort((a, b) => b[1] - a[1]);
  const top10Points = sortedPoints.slice(0, 10);
  let response = 'Berikut 10 top User:\n';

  top10Points.forEach((point, index) => {
    const rankTitle = getRankTitle(point[1]);
    if (point[0] === username) {
      response += `> *${point[0]} (You)*\n`;
    } else {
      response += `> ${point[0]}\n`;
    }
    response += `- position: ${index + 1}\n- points: ${point[1]}\n- ranks: ${rankTitle}\n`;
  });
  return response;
}

const initializeFiles = () => {
  if (!fs.existsSync('./DB/soal.json')) fs.writeFileSync('./DB/soal.json', '{}');
  if (!fs.existsSync('./DB/nyerah.json')) fs.writeFileSync('./DB/nyerah.json', '{}');
  if (!fs.existsSync('./DB/point.json')) fs.writeFileSync('./DB/point.json', '{}');
};

const jackpot = (username, taruhan) => {
    if (/[^0-9]/.test(taruhan)) {
    return 'Taruhan tidak valid, hanya angka yang diizinkan.';
  }

  let pointData = JSON.parse(fs.readFileSync('./DB/point.json'));

  if (pointData[username] < taruhan) {
    return `Maaf ${username}, point kamu tidak cukup untuk taruhan. Yuk, main *.susunkata* atau *.caklontong* dulu untuk menambah point.`;
  }
    let emoji = ['7️⃣','🥭','🍎'];
    let papan = Array(3).fill();
    let comboMenang = Math.random() < 0.1;

    for (let i = 0; i < 3; i++) {
        if (comboMenang) {
            papan[i] = 0;
        } else {
            papan[i] = Math.floor(Math.random() * 3);
        }
    }

    let hasilPapan = papan.map(i => emoji[i]).join('•');

    if (comboMenang || (papan[0] === 0 && papan[1] === 0 && papan[2] === 0)) {
        pointData[username] += taruhan * 2;
        fs.writeFileSync('./DB/point.json', JSON.stringify(pointData));
        return `${hasilPapan}\n\nYay! Jackpot! Selamat ${username}, kamu mendapatkan ${taruhan * 2} point.`;
    } else {
        pointData[username] -= taruhan;
        fs.writeFileSync('./DB/point.json', JSON.stringify(pointData));
        return `${hasilPapan}\n\nSayang sekali, kamu belum beruntung kali ini. Point kamu berkurang ${taruhan}.`;
    }
}

const hint = (username) => {
  const soalData = JSON.parse(fs.readFileSync('./DB/soal.json'));
  const pointData = JSON.parse(fs.readFileSync('./DB/point.json'));

  if (!soalData[username]) {
    return `Sepertinya ${username} belum mengambil soal`;
  }

  if ((pointData[username] || 0) < 1) {
    return `Point kamu tidak cukup untuk membeli hint`;
  }

  const soal = soalData[username];
  const jawaban = soal.jawaban;
  let jumlahKarakter = Math.floor(jawaban.length / 2);

  let hint = '';
  for (let i = 0; i < jawaban.length; i++) {
    if (i < jumlahKarakter) {
      hint += jawaban[i];
    } else {
      hint += '×';
    }
  }

  pointData[username] -= 1;
  fs.writeFileSync('./DB/point.json', JSON.stringify(pointData));
  return `Hint : *${hint.toUpperCase()}* .  Point di kurangi 1`;
};

//Game Nya
const game = async (typeGame, username) => {
  const nyerahData = JSON.parse(fs.readFileSync('./DB/nyerah.json'));
  const soalData = JSON.parse(fs.readFileSync('./DB/soal.json'));

  if (nyerahData[username]) {
    delete nyerahData[username];
    fs.writeFileSync('./DB/nyerah.json', JSON.stringify(nyerahData));
  }

  if (!soalData[username]) {
    let response;
    let soal;
    switch (typeGame) {
      case 'tebakkata':
        response = await axios.get('https://raw.githubusercontent.com/ramadhankukuh/database/master/src/games/tebakkata.json');
        soal = response.data[Math.floor(Math.random() * response.data.length)];
        break;
      case 'math':
        response = generateMathProblems();
        soal = response[0];
        break;
      case 'asahotak':
        response = await axios.get('https://raw.githubusercontent.com/ramadhankukuh/database/master/src/games/asahotak.json');
        soal = response.data[Math.floor(Math.random() * response.data.length)];
        break;
      case 'siapaaku':
        response = await axios.get('https://raw.githubusercontent.com/ramadhankukuh/database/master/src/games/siapakahaku.json');
        soal = response.data[Math.floor(Math.random() * response.data.length)];
        break;
      case 'caklontong':
        response = await axios.get('https://raw.githubusercontent.com/ramadhankukuh/database/master/src/games/caklontong.json');
        soal = response.data[Math.floor(Math.random() * response.data.length)];
        break;
      case 'susunkata':
        response = await axios.get('https://raw.githubusercontent.com/ramadhankukuh/database/master/src/games/susunkata.json');
        soal = response.data[Math.floor(Math.random() * response.data.length)];
        break;
      default:
        return `Game type not supported`;
    }
    soalData[username] = soal;
    fs.writeFileSync('./DB/soal.json', JSON.stringify(soalData));
    return `Jawab soal berikut:\n*soal :* ${soal.soal}${soal.tipe ? `\n*tipe :* ${soal.tipe}` : ''}`;
  } else {
    const soal = soalData[username];
    return `${username} kamu belum menjawab soal ini :\n*soal :* ${soal.soal}${soal.tipe ? `\n*tipe :* ${soal.tipe}` : ''}`;
  }
};

const jawabSoal = (username, jawaban) => {
  const soalData = JSON.parse(fs.readFileSync('./DB/soal.json'));
  const pointData = JSON.parse(fs.readFileSync('./DB/point.json'));
  const randomNumber = 10

  let soal;
  let pemilikSoal;

  for (let user in soalData) {
    if (jawaban.toUpperCase() === soalData[user].jawaban.toUpperCase()) {
      soal = soalData[user];
      pemilikSoal = user;
      break;
    }
  }

  if (!soal) {
    return `Jawaban *salah* atau soal berhasil dijawab oleh user lain. *Yuk ambil lagi soalnya*`;
  }

  pointData[username] = (pointData[username] || 0) + randomNumber;
  const deskripsi = soal.deskripsi;
  delete soalData[pemilikSoal];
  fs.writeFileSync('./DB/soal.json', JSON.stringify(soalData));
  fs.writeFileSync('./DB/point.json', JSON.stringify(pointData));

  if (username === pemilikSoal) {
    return deskripsi ? `*Benar* ${deskripsi}. Point +${randomNumber}` : `*Benar* Kamu mendapatkan ${randomNumber} point`;
  } else {
    return deskripsi ? `*Benar* ${deskripsi}. Point +${randomNumber}. *BTW* Itu soal punya ${pemilikSoal}` : `*Benar* Kamu mendapatkan ${randomNumber} point. *BTW* Itu soal punya ${pemilikSoal}`;
  }
};

const nyerah = (username) => {
  const pointData = JSON.parse(fs.readFileSync('./DB/point.json'));
  const soalData = JSON.parse(fs.readFileSync('./DB/soal.json'));
  if (soalData[username]) {
    const jawaban = soalData[username].jawaban; 
    delete soalData[username];
    fs.writeFileSync('./DB/soal.json', JSON.stringify(soalData));
    if (pointData[username] >= 15) {
      pointData[username] -= 2;
      fs.writeFileSync('./DB/point.json', JSON.stringify(pointData));
      return `*NYERAH YA* Saya akan memotong 2 point anda\n\n> *Jawaban :* ${jawaban}`;
    } else {
      return `Point kamu di bawah 15 aku gak tega motong point kamu\n\n> *Jawaban :* ${jawaban}`;
    }
  } else {
    return `${username} belum ngambil soal udah nyerah hadeh`;
  }
};

initializeFiles();

module.exports = { jackpot, hint, game, jawabSoal, skor, topskor, nyerah };

