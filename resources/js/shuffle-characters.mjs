import fs from "fs";
import readline from "readline";

async function shuffleCharacters(input, output, skipCharacters) {
    
    console.log("Shuffling character list...");
    console.log("Skipping " + skipCharacters);

    const fileStream = fs.createReadStream(input);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let characters = [];
    for await (const line of rl) {
        if(!skipCharacters.includes(line)) {
            characters.push(line);
        }
    }
    shuffle(characters);
    
    let randomizedCharacters = '';
    skipCharacters.forEach((charName) => {
        randomizedCharacters += charName + '\n';
    })
    characters.forEach((character) => {
        randomizedCharacters += character + '\n';
    })
    randomizedCharacters = randomizedCharacters.substring(0, randomizedCharacters.length - 1);
    fs.writeFile(output, randomizedCharacters, (error) => {
        if (error) throw error;
    });

    await new Promise(r => setTimeout(r, 200));

    console.log("Done shuffling.")
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

const inputHard = 'resources/txt/characters.txt';
const outputHard = 'resources/txt/randomized.txt';

const inputNormal = 'resources/txt/charactersNormal.txt';
const outputNormal = 'resources/txt/randomizedNormal.txt'

// shuffleCharacters(inputNormal, outputNormal, 
//     ['','','','','','','','','','','','','','','','','','','','',
//     'Bessho Kazuyoshi',
//     'Goshiki Tsutomu (Timeskip)',
//     'Washio Tatsuki',
//     'Akakura Kai',
//     'Ennoshita Chikara',
//     'Koganegawa Kanji (Timeskip)',
//     'Azumane Asahi',
//     'Aone Takanobu',
//     'Anahori Shuichi',
//     'Matsukawa Issei',
//     'Kageyama Tobio',
//     'Hinata Shoyo',
//     'Kawanishi Taichi',
//     'Hyakuzawa Yudai (Timeskip)',
//     'Hirugami Sachiro',
//     'Alexander Joffe',
//     'Ojiro Aran (Timeskip)',
//     'Obara Yutaka',
//     'Ginjima Hitoshi',
//     'Koganegawa Kanji',
//     'Suwa Aikichi',
//     'Miya Atsumu (Timeskip)',
//     'Tokura Liam',
//     'Onagawa Taro',
//     'Ushijima Wakatoshi (Timeskip)',
//     'Komi Haruki',
//     'Sokolov Tatsuto',
//     'Oikawa Tooru',
//     'Kozume Kenma',
//     'Yamamoto Taketora',
//     'Kuguri Naoyasu',
//     'Kanbayashi Keiichiro',
//     'Shirabu Kenjiro',
//     'Kyotani Kentaro',
//     'Akagi Michinari',
//     'Yaku Morisuke',
//     'Tendo Satori',
//     'Semi Eita',
//     'Sasaya Takehito',
//     'Nekomata Yasufumi',
//     'Suna Rintaro (Timeskip)',
//     'Nakashima Takeru',
//     'Kamasaki Yasushi',
//     'Omimi Ren',
//     'Michimiya Yui',
//     'Tsukishima Kei',
//     'Meian Shugo',
//     'Kageyama Tobio (Timeskip)',
//     'Takeda Ittetsu',
//     'Miya Atsumu',
//     'Kai Nobuyuki',
//     'Iwaizumi Hajime',
//     'Komori Motoya (Timeskip)',
//     'Sagae Yusho']);

shuffleCharacters(inputHard, outputHard, [
    'Numai Kazuma',
'Izaka Nobuyoshi',
'Bobata Kazuma',
'Shibuya Rikuto',
'Kai Ryosei',
'Kawatabi Shunki',
'Tsuchiyu Arata',
'Sakishima Isumi',
'Hondo Subaru',
'Sasaya Takehito',
'Komi Haruki',
'Atema Yoshitomo',
'Tsukishima Kei',
'Akaashi Keiji',
'Chigaya Eikichi',
'Semi Eita',
'Narita Kazuhito',
'Akakura Kai',
'Himekawa Aoi',
'Iizuna Tsukasa (Timeskip)',
'Anahori Shuichi',
'Iwamuro Togo',
'Seguro Akihiko',
'Runa Kuribayashi',
'Gora Masaki',
'Heiwajima Toshiro',
'Kyotani Kentaro',
'Moritake Ayumu',
'Shimizu Kiyoko',
'Hirugami Fukuro',
'Kuroo Tetsuro',
'Oyasu Soma',
'Terushima Yuji',
'Naruko Teppei',
'Mami Nozomu',
'Ojiro Aran',
'Hinata Shoyo',
'Shiga Tomonari',
'Michimiya Yui',
'Onagawa Taro',
'Hoshiumi Korai (Timeskip)',
'Shibayama Yuki',
'Kamasaki Yasushi',
'Nishinoya Yuu',
'Omimi Ren',
'Hoshiumi Korai',
'Oliver Barnes',
'Nicolas Romero',
'Kai Nobuyuki',
'Sarukui Yamato',
'Futamata Takeharu',
'Yokote Shun',
'Fukiage Jingo',
'Sagae Yusho',
'Kaikake Akifumi',
'Komaki Hikaru',
'Nozawa Izuru',
'Bokuto Kotaro',
'Tamagawa Hiroki',
'Higashiyama Katsumichi',
'Goshiki Tsutomu',
'Kawanishi Taichi',
'Ikejiri Hayato',
'Sakurai Taiga',
'',
'Hakuba Gao (Timeskip)',
'Meian Shugo',
'Alexander Joffe',
'Tsukishima Kei (Timeskip)',
'Kanbayashi Keiichiro',
'Natsuse Ibuki',
'Akama So',
'Aone Takanobu',
'Minamida Taishi'
])

// shuffleCharacters(inputNormal, outputNormal, ['','','','','','','','','','','','','','','','','','','']);
// 'Numai Kazuma',
//     'Izaka Nobuyoshi',
//     'Bobata Kazuma',
//     'Shibuya Rikuto',
//     'Kai Ryosei',
//     'Kawatabi Shunki',
//     'Tsuchiyu Arata',
//     'Sakishima Isumi',
//     'Hondo Subaru',
//     'Sasaya Takehito',
//     'Komi Haruki',
//     'Atema Yoshitomo',
//     'Tsukishima Kei',

// ikejiri
// ginjima