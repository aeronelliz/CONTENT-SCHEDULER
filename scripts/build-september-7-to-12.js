import fs from "node:fs/promises";

const dailyTimes = ["08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00", "20:00:00"];
const caption = (...paragraphs) => paragraphs.join("\n\n");

const days = {
  "2026-09-07": [
    {
      slug: "yamashita",
      title: "Ang Gintong Buddha",
      type: "Philippine mystery",
      text: caption(
        "Isang treasure hunter. Isang higanteng gintong Buddha. At isang kayamanang sinasabing nawala matapos itong makita.",
        "Noong 1971, sinabi ni Rogelio Roxas na nakahanap siya ng isang napakabigat na gold-colored Buddha at mga kahon sa isang tunnel malapit sa Baguio. Ayon sa kanyang salaysay, sampung lalaki pa ang kinailangan para maiakyat ang estatwa. Hindi nagtagal, sinalakay umano ang kanyang bahay at kinuha ang natagpuan niya.",
        "Hindi lang ito naging alamat sa mga treasure hunter. Umabot ang usapin sa korte sa Hawaii. Doon, nakita ng hukuman na may sapat na ebidensya para suportahan ang finding na nakahanap si Roxas ng treasure at na-convert ito ni Ferdinand Marcos. Pero binago rin ng korte ang napakalaking damage award dahil hindi sapat ang ebidensya para tukuyin ang dami at purity ng lahat ng sinasabing bullion.",
        "Iyan ang mahalagang twist: may bahagi ng kuwento na umabot sa legal finding, pero hindi nito pinatutunayan ang bawat bersyon ng Yamashita treasure na kumalat online. Ang eksaktong laman ng mga kahon, ang pinagmulan ng estatwa, at kung nasaan ito ngayon ay nananatiling puno ng tanong.",
        "Kung ikaw ang nakakita nito, kanino ka unang lalapit: pulis, museo, abogado, o media?"
      )
    },
    {
      slug: "rizal-retraction",
      title: "Rizal: Binawi Ba Niya?",
      type: "Philippine history",
      text: caption(
        "Ilang oras bago siya barilin, pumirma ba si José Rizal sa dokumentong babago sa pagbasa natin sa kanyang huling gabi?",
        "May dokumentong may petsang Disyembre 29, 1896 na nagsasabing binabawi ni Rizal ang ilang pahayag laban sa Simbahang Katolika. Pero ang sinasabing orihinal ay lumitaw lamang noong 1935, halos apatnapung taon matapos ang kanyang kamatayan.",
        "May mga testimonya at pangyayaring ginagamit ng mga naniniwalang tunay ang retraction. Mayroon ding mga historyador na kumukuwestiyon sa handwriting, wording, chain of custody, at pagkakaiba ng mga naunang kopya. Kaya ang pag-iral ng dokumento ay katotohanan; ang authenticity at buong kahulugan nito ang pinagtatalunan.",
        "Mahalaga ring tandaan: kahit mapatunayang pumirma siya, hindi nito awtomatikong binubura ang mga nobela, sulat, at ideyang iniwan niya. At kung peke naman, kailangang ipaliwanag kung paano at bakit ito nagkaroon ng ganitong mahabang buhay.",
        "Para sa iyo, ano ang mas mabigat: ang dokumento, ang mga saksi, o ang kabuuan ng mga ginawa ni Rizal?"
      )
    },
    {
      slug: "pepsi-349",
      title: "Ang Numerong 349",
      type: "Philippine true story",
      text: caption(
        "Isang bottle cap ang nangakong magpapabago ng buhay. Pagkatapos, libo-libong tao ang sabay-sabay na naniwalang sila ang nanalo.",
        "Noong 1992, naging pambansang obsession ang Pepsi Number Fever. Gabi-gabi, hinihintay ng mga tao ang winning number. Nang ianunsyo ang 349, napakaraming may hawak ng cap na kapareho ng numero ang lumitaw.",
        "Doon nagsimula ang gulo. Sinabi ng kumpanya na iilan lamang ang tunay na winning caps dahil may espesyal na security code. Para sa maraming may hawak ng 349, malinaw ang mensahe ng promo: tumama ang numero nila. Sumunod ang protesta, kaso, at mga pangyayaring lumampas na sa simpleng marketing error.",
        "Sa mga desisyon ng korte, naging sentro ang mechanics at security code ng promo. Pero kahit natapos ang ilang legal na laban, nanatili ang 349 bilang halimbawa ng puwedeng mangyari kapag ang pangako ng isang campaign ay mas mabilis kumalat kaysa sa proteksiyong inilagay laban sa pagkakamali.",
        "Kung numero lang ang malinaw na nakita mo sa ad, maniniwala ka bang panalo ka?"
      )
    },
    {
      slug: "pal-812",
      title: "Ang Hijacker na Tumalon",
      type: "Philippine true crime",
      text: caption(
        "Parang eksena sa pelikula: ninakawan ang mga pasahero, binuksan ang pinto ng eroplano, at tumalon ang hijacker gamit ang sarili niyang parachute.",
        "Noong Mayo 25, 2000, malapit nang lumapag sa Manila ang Philippine Airlines Flight 812 mula Davao nang kontrolin ito ng isang lalaking kalauna'y nakilalang si Reginald Chua. Kinuha niya ang pera at mahahalagang gamit ng mga pasahero bago ipinababa at ipinadepressurize ang eroplano.",
        "Ang kakaiba, homemade ang dala niyang parachute. Wala itong normal na rip cord kaya gumamit pa ng improvised na tali. Sa lakas ng hangin sa bukas na pinto, nahirapan siyang tumalon. Nakalapag nang ligtas ang eroplano at nakaligtas ang iba pang 290 sakay.",
        "Hindi naging matagumpay ang pagtakas. Natagpuan ang hijacker makalipas ang ilang araw matapos hindi gumana nang maayos ang parachute. Kaya hindi ito unsolved mystery, kundi isang totoong krimen na mas kakaiba pa sa fiction.",
        "Ano ang mas nakakagulat sa iyo: ang plano, ang improvised parachute, o ang katotohanang nakaligtas ang lahat ng ibang sakay?"
      )
    },
    {
      slug: "dyatlov",
      title: "Ang Lihim ng Dyatlov Pass",
      type: "Global mystery",
      text: caption(
        "Bakit hihiwain ng siyam na bihasang hikers ang kanilang tent mula sa loob at lalabas sa nagyeyelong gabi nang kulang ang suot?",
        "Noong Pebrero 1959, nawala ang grupo ni Igor Dyatlov sa Ural Mountains. Natagpuan ang kanilang tent na tila iniwan nang biglaan. Ang mga bakas ng paa ay bumababa sa dalisdis, habang naiwan sa loob ang mahahalagang gamit at damit.",
        "Dahil kakaiba ang eksena, lumitaw ang mga teorya tungkol sa lihim na military test, kakaibang ilaw, at maging hindi pangkaraniwang nilalang. Pero wala sa mga iyon ang napatunayang dahilan.",
        "Sa mga makabagong pag-aaral, avalanche o snow-slab event ang isa sa pinakamalakas na paliwanag. Maaaring napilitang lumabas ang grupo at hindi na sila nakabalik dahil sa matinding lamig, dilim, at terrain. Gayunman, hindi lahat ay kumbinsido na nasasagot nito ang bawat detalye.",
        "Minsan, hindi kailangan ng halimaw para maging nakakatakot ang isang bundok. Sapat na ang maling desisyon sa maling minuto. Para sa iyo, solved na ba ito?"
      )
    },
    {
      slug: "isdal-woman",
      title: "Sino ang Isdal Woman?",
      type: "Global mystery",
      text: caption(
        "Walang labels ang kanyang mga damit. Iba-iba ang pangalang ginamit niya. At ang mga note sa kanyang maleta ay parang code.",
        "Noong 1970, natagpuan ang isang hindi nakikilalang babae sa Isdalen Valley sa Norway. Sa imbestigasyon, lumabas na naglakbay siya sa iba't ibang lugar gamit ang maraming alias. Tinanggal ang labels sa kanyang mga gamit at may mga petsa at letra sa notebook na kalauna'y iniugnay sa kanyang mga biyahe.",
        "Dahil Cold War noon, mabilis nabuo ang spy theory. May nagsabing intelligence agent siya; may nagsabing ordinaryong tao na sadyang nagtago ng identity. Hanggang ngayon, wala pang pampublikong ebidensyang tuluyang nagpapatunay sa alinman.",
        "Modernong isotope analysis sa ngipin at iba pang forensic work ang tumulong magbigay ng posibleng pinanggalingang rehiyon at galaw niya. Pero hindi pa rin sapat para bigyan siya ng tiyak na pangalan.",
        "Kapag maraming alias ang isang tao, palatandaan ba iyon ng lihim na trabaho, o ng buhay na pilit niyang tinatakasan?"
      )
    },
    {
      slug: "max-headroom",
      title: "Sino ang Sumingit sa Signal?",
      type: "Global mystery",
      text: caption(
        "Dalawang TV station ang naagawan ng signal. Isang taong naka-Max Headroom mask ang lumitaw. Hanggang ngayon, walang nakilalang gumawa.",
        "Noong Nobyembre 22, 1987, naputol ang broadcast ng dalawang Chicago television station. Sa screen, may naka-mask na pigurang gumagalaw sa harap ng umiikot na background at nagsasalita ng halos walang saysay na linya.",
        "Hindi ito simpleng pag-edit ng video. Kinailangang matabunan ng gumawa ang totoong microwave link o broadcast signal ng station. Ibig sabihin, kailangan niya ng teknikal na kaalaman, tamang kagamitan, at tamang lokasyon.",
        "Nag-imbestiga ang mga awtoridad, pero walang naharap na napatunayang responsable. Maraming pangalan at theory ang lumitaw sa internet paglipas ng mga taon, ngunit wala pang public evidence na nagtatapos sa kaso.",
        "Ang pinaka-plot twist: mas advanced na ngayon ang technology, pero ang taong gumamit ng lumang analog signal ay nananatiling anonymous. Sino sa tingin mo ang may kakayahang gumawa nito noong 1987?"
      )
    }
  ],
  "2026-09-08": [
    {
      slug: "ozone",
      title: "Ang Gabi sa Ozone",
      type: "Philippine true story",
      text: caption(
        "Isang graduation party ang dapat sana'y masayang alaala. Sa loob ng ilang minuto, naging isa ito sa pinakamabigat na nightclub disasters sa kasaysayan ng Pilipinas.",
        "Noong Marso 18, 1996, puno ng kabataan ang Ozone Disco sa Quezon City nang sumiklab ang apoy. Marami ang nagtungo sa pangunahing labasan, ngunit naging kritikal ang sikip, layout, at direksiyon ng pinto habang kumakalat ang usok.",
        "Mahigit 150 ang nasawi at marami pa ang nasaktan. Hindi kailangang ilarawan nang graphic ang nangyari para maunawaan ang bigat nito. Ang mahalagang tanong ay kung paano nakapag-operate ang lugar sa kondisyong hindi ligtas para sa dami ng tao sa loob.",
        "Makalipas ang maraming taon, may mga nahatulang opisyal kaugnay ng mga permit at inspeksiyon. Ang kuwento ng Ozone ay hindi supernatural mystery. Isa itong paalala na ang fire exits, occupancy limits, at inspection records ay mga bagay na literal na nagliligtas ng buhay.",
        "Kapag pumasok ka sa isang venue, tinitingnan mo ba agad kung nasaan ang pinakamalapit na exit?"
      )
    },
    {
      slug: "princess-stars",
      title: "Ang Bagyong Hindi Iniwasan",
      type: "Philippine true story",
      text: caption(
        "May bagyo sa ruta. May daan-daang tao sa barko. Bakit nagpatuloy ang biyahe ng MV Princess of the Stars?",
        "Noong Hunyo 21, 2008, tumaob ang ferry malapit sa Sibuyan Island habang nananalasa ang Typhoon Fengshen, o Frank. Mahigit walong daang pasahero at crew ang nasa listahan, at kakaunti lamang ang nakaligtas.",
        "Habang naghahanap ang mga rescuer, may isa pang komplikasyong lumitaw: may kargang nakalalasong pesticide ang barko. Kinailangang maging mas maingat ang recovery at salvage operations dahil hindi lamang pagkawala ng buhay ang panganib, kundi pati posibleng epekto sa dagat.",
        "Sinuri ng mga imbestigasyon ang desisyon sa paglalayag, weather information, at pananagutan ng operator at mga ahensiya. Hindi ito kuwentong may iisang kontrabidang madaling ituro. Isa itong chain of decisions na nauwi sa sakuna.",
        "Kung may severe-weather warning, sino ang dapat magkaroon ng huling salita: kapitan, kumpanya, o coast guard?"
      )
    },
    {
      slug: "snake-man",
      title: "Ang Snake-Man sa Mall",
      type: "Philippine urban legend",
      text: caption(
        "May lihim daw sa ilalim ng fitting room. May kalahating tao, kalahating ahas daw na naghihintay. Pero saan talaga nagsimula ang kuwento?",
        "Noong 1980s at 1990s, kumalat ang alamat tungkol sa isang snake-man na itinatago raw sa isang malaking mall. Isinama pa sa mga bersyon ng kuwento ang aktres na si Alice Dixson at isang diumano'y trapdoor sa fitting room.",
        "Nakakatakot pakinggan, pero walang mapagkakatiwalaang ebidensya na may ganitong nilalang o insidente. Itinanggi rin ni Dixson ang pinakasikat na bersyon. Ang mayroon tayo ay isang urban legend na paulit-ulit na binago habang ipinapasa mula bibig, tabloid, text message, hanggang social media.",
        "Posibleng nakatulong sa pagkalat nito ang takot sa bagong malalaking mall, corporate families, at mga kuwentong may lihim sa likod ng yaman. Iyan ay pagbasa sa kultura, hindi patunay ng halimaw.",
        "Anong bersyon ng snake-man story ang unang narinig mo, at sino ang nagkuwento sa iyo?"
      )
    },
    {
      slug: "kalantiaw",
      title: "Ang Huwad na Kalantiaw",
      type: "Philippine historical mystery",
      text: caption(
        "Itinuro sa paaralan. Ginawan ng marker. Pinangalanan pa ang isang award. Pagkatapos, lumabas na walang matibay na basehan ang buong kuwento.",
        "Ang Code of Kalantiaw ay matagal na ipinakilalang sinaunang batas mula 1433 na inuugnay kay Datu Kalantiaw. Dahil paulit-ulit itong lumitaw sa aklat at seremonya, naging bahagi ito ng popular na larawan ng precolonial Philippines.",
        "Ngunit sa masusing pag-aaral ng pinagmulan, ipinakita ng historyador na si William Henry Scott na ang dokumentong pinanggalingan nito ay hindi mapagkakatiwalaang sinaunang source. Walang independent evidence para sa code o sa datung sinasabing gumawa nito.",
        "Noong 2004, pormal na kinilala ng National Historical Institute na walang historical basis ang Code of Kalantiaw. Ang plot twist ay hindi kung gaano kalupit ang mga batas, kundi kung paano naging opisyal na kasaysayan ang isang imbento.",
        "Kapag matagal nang nasa textbook ang isang kuwento, gaano kahirap para sa atin na tanggapin na mali ito?"
      )
    },
    {
      slug: "somerton",
      title: "Sino ang Somerton Man?",
      type: "Global mystery",
      text: caption(
        "Isang di-kilalang lalaki sa tabing-dagat. Isang piraso ng papel na may salitang 'Tamám Shud.' At isang code na hindi maipaliwanag.",
        "Noong Disyembre 1948, natagpuan ang lalaki sa Somerton Beach sa Australia. Wala siyang malinaw na identification, at tinanggal ang ilang labels sa kanyang damit. Sa lihim na bulsa, nakita ang piraso ng pahina mula sa Rubaiyat na ang ibig sabihin ay 'tapos na.'",
        "Nang mahanap ang aklat na pinanggalingan ng papel, may nakasulat na mga letra sa likod nito. Code ba iyon, shorthand, o random notes? Walang tiyak na sagot. Dahil Cold War era, pumasok din ang spy theory, pero hindi ito napatunayan.",
        "Makalipas ang mahigit pitumpung taon, isang DNA genealogy team ang nagmungkahi na siya si Carl Webb. Malaking breakthrough iyon, ngunit ang pormal na pagkilala at eksaktong dahilan ng kanyang pagkamatay ay hiwalay na mga tanong na kailangang tapusin ng mga awtoridad.",
        "Kapag nalaman na ang pangalan, masasabi bang solved na ang misteryo?"
      )
    },
    {
      slug: "flannan",
      title: "Ang Tatlong Keeper",
      type: "Global mystery",
      text: caption(
        "Bukas ang lighthouse. Nandoon ang ilaw. Pero ang tatlong lalaking dapat nagbabantay rito ay wala.",
        "Noong Disyembre 1900, dumating ang relief vessel sa Flannan Isles lighthouse sa Scotland at walang sumalubong. Nawawala sina James Ducat, Thomas Marshall, at Donald MacArthur. May mga kagamitang iniwan at may pinsala sa landing area na tanda ng napakalakas na dagat.",
        "Ang opisyal na paliwanag ay posibleng lumabas ang mga keeper para ayusin o siguruhin ang kagamitan at tinangay ng biglaang malaking alon. Praktikal ito at tugma sa panganib ng isla, ngunit walang direktang saksi.",
        "Lumaki ang alamat dahil sa mga dagdag na detalyeng hindi naman nasa original records, tulad ng kalahating pagkain o misteryosong log entries. Kapag inalis ang mga imbentong iyon, malungkot pa rin ang totoong tanong: bakit sabay-sabay silang nasa labas?",
        "Aksidente sa dagat, o may nawawalang bahagi pa ng kuwento?"
      )
    },
    {
      slug: "wow-signal",
      title: "Ang Wow! Signal",
      type: "Global science mystery",
      text: caption(
        "Tumagal lamang ito nang 72 segundo, pero sapat para itanong ng mundo: may tumawag ba mula sa kalawakan?",
        "Noong Agosto 15, 1977, nakakuha ang Big Ear radio telescope ng Ohio State University ng napakalakas at makitid na radio signal. Nang makita ni astronomer Jerry Ehman ang printout, bilugan niya ang code at isinulat ang salitang 'Wow!'",
        "Ang signal ay nasa frequency na interesante sa mga naghahanap ng extraterrestrial intelligence. Pero hindi na ito muling nakuha sa parehong paraan, kahit ilang beses hinanap. Dahil walang repeat, hindi matukoy kung natural source, human interference, o ibang bagay.",
        "May mga mungkahing comet o hydrogen cloud ang dahilan, at may mga bagong candidate explanations sa paglipas ng panahon. Wala pa ring iisang paliwanag na tinanggap bilang final. At higit sa lahat, ang Wow! Signal ay hindi patunay ng aliens.",
        "Kung isang beses lang dumating ang mensahe, paano mo malalaman kung tunay itong mensahe at hindi cosmic coincidence?"
      )
    }
  ],
  "2026-09-09": [
    {
      slug: "nida-blanca",
      title: "Sino ang Pumaslang kay Nida?",
      type: "Philippine true crime",
      text: caption(
        "Isa siyang minamahal na bituin. Isang gabi noong 2001, natagpuan siya sa parking area ng isang gusali. Makalipas ang mga taon ng kaso at paratang, wala pa ring kumpletong sagot.",
        "Ang pagkamatay ni Nida Blanca ay mabilis na naging isa sa pinakatinutukang krimen sa bansa. Maraming tao ang naimbestigahan at nagkaroon ng magkasalungat na testimonya. Ang kanyang asawang si Rod Strunk ay inakusahan, ngunit itinanggi niya ang pagkakasangkot at hindi nagkaroon ng final conviction laban sa kanya bago siya namatay.",
        "May iba pang pangalang lumitaw sa mga kaso, ngunit ang paratang ay hindi katumbas ng hatol. Kapag nagbabago ang testimonya o hindi sapat ang ebidensya, kailangang maging maingat sa pagbanggit ng sinumang tao bilang salarin.",
        "Iyan ang mahirap sa kasong ito: sikat ang biktima, kaya napakaraming theory. Pero ang ingay ng publiko ay hindi kapalit ng matibay na ebidensya sa korte.",
        "Sa tingin mo, ano ang mas nakasira sa paghahanap ng katotohanan: kulang na ebidensya, magulong testimonya, o trial by publicity?"
      )
    },
    {
      slug: "apo-annu",
      title: "Ang Ninakaw na Apo Annu",
      type: "Philippine heritage mystery",
      text: caption(
        "Hindi ginto ang ninakaw. Mas mahalaga pa: isang ninuno na sagradong bahagi ng komunidad.",
        "Si Apo Annu ay isa sa mga bantog na fire mummies ng Kabayan, Benguet. Sa tradisyon ng Ibaloi, hindi lamang artifact ang mga labi ng ninuno. May identidad, kuwento, at espirituwal na kaugnayan ang mga ito sa lugar at pamilya.",
        "Noong unang bahagi ng ika-20 siglo, nawala si Apo Annu mula sa kanyang himlayan at napunta sa kamay ng mga kolektor sa labas ng bansa. Lumipas ang maraming dekada bago siya natunton at naibalik sa Benguet sa pagtatapos ng siglo.",
        "Ang twist ay nasa salitang 'pag-aari.' Para sa collector, maaaring rare object ito. Para sa komunidad, ninuno siyang hindi dapat inalis. Kaya ang pagbabalik niya ay hindi simpleng museum transfer, kundi isang anyo ng cultural justice.",
        "Kapag ang isang sagradong bagay ay legal na nabili noon pero kinuha sa maling konteksto, sino ang tunay na may karapatan dito?"
      )
    },
    {
      slug: "jabidah",
      title: "Ano ang Nangyari sa Jabidah?",
      type: "Philippine historical controversy",
      text: caption(
        "May lihim na training sa Corregidor. May mga kabataang Moro na sinasabing hindi na nakauwi. At may isang kuwentong nagbago sa pulitika ng Mindanao.",
        "Noong Marso 1968, lumabas ang ulat tungkol sa pagpatay sa mga trainee ng tinaguriang Jabidah unit. Iniuugnay ang training sa planong operasyon sa Sabah. Isang survivor, si Jibin Arula, ang nagbigay ng salaysay na naging sentro ng national investigation.",
        "Hindi nagkasundo ang mga record sa eksaktong bilang ng mga napatay, at hindi nagtapos ang mga inquiry sa iisang kumpletong legal na bersyon. Kaya mahalagang sabihin nang malinaw: totoong may training at kontrobersiya; pinagtatalunan ang ilang detalye at saklaw ng insidente.",
        "Gayunman, naging makapangyarihang simbolo ang Jabidah sa pag-usbong ng Moro political consciousness at separatist movements. Kahit may puwang sa record, totoo ang naging epekto nito sa kasaysayan.",
        "Kapag hindi kumpleto ang opisyal na tala, paano dapat alalahanin ang isang pangyayaring humubog sa isang buong rehiyon?"
      )
    },
    {
      slug: "bonifacio-bones",
      title: "Nasaan ang mga Buto ni Bonifacio?",
      type: "Philippine historical mystery",
      text: caption(
        "Pinatay si Andres Bonifacio noong 1897. Makalipas ang dalawang dekada, may mga butong ipinahayag na kanya. Pagkatapos, nawala rin ang mga ito.",
        "Noong 1918, may nahukay na mga labi sa Maragondon na iniugnay kay Bonifacio. Dinala ang mga ito sa Manila at naging bahagi ng pambansang paggunita. Ngunit kahit noon, may tanong na kung sapat ba ang pagkakakilanlan at eksaktong lokasyon ng pagkakahukay.",
        "Nang masira ang Legislative Building sa Battle of Manila noong 1945, nawala ang maraming collection. Kabilang sa pinaniniwalaang nawala ang sinasabing mga buto ni Bonifacio. Wala ring modernong DNA test na nakapagkumpirma sa identity ng mga labi bago ito mawala.",
        "Kaya dalawang misteryo ang naiwan: tunay bang kay Bonifacio ang nahukay, at kung oo, may nakaligtas bang bahagi nito matapos ang digmaan?",
        "Mahalaga ba sa pag-alala sa isang bayani na mahanap ang kanyang mga labi, o sapat na ang kanyang mga ginawa?"
      )
    },
    {
      slug: "zodiac",
      title: "Sino ang Zodiac Killer?",
      type: "Global true crime",
      text: caption(
        "Nagpadala siya ng mga liham at cipher sa diyaryo. Nagbigay siya ng sarili niyang pangalan: Zodiac. Pero ang tunay niyang pangalan ay hindi napatunayan.",
        "Noong huling bahagi ng 1960s, iniugnay ang Zodiac sa serye ng pag-atake sa Northern California. Ginamit niya ang media para magbanta at humingi ng publicity. Ang ilang cipher ay nalutas, ngunit hindi nito ibinigay ang identity na kailangan ng imbestigasyon.",
        "Maraming suspect ang iminungkahi sa mga libro, documentary, at online groups. Paminsan-minsan, may headline na nagsasabing 'solved' na ang kaso. Ngunit kung hindi kinukumpirma ng law enforcement at walang ebidensyang kayang tumayo sa korte, claim pa rin iyon, hindi final answer.",
        "Ang panganib sa ganitong kaso ay ang pagpilit magkasya ang bawat clue sa paboritong suspect. Mas kapana-panabik iyon, pero maaari ring makasira sa pangalan ng inosenteng tao.",
        "Ano ang mas kailangan para masabing solved ang Zodiac: DNA match, confession, o kumpletong chain of evidence?"
      )
    },
    {
      slug: "voynich",
      title: "Ang Aklat na Walang Makabasa",
      type: "Global mystery",
      text: caption(
        "Mahigit animnaraang taon na ang aklat. Totoo ang parchment. Totoo ang tinta. Pero hanggang ngayon, walang tiyak na nakababasa sa sulat.",
        "Ang Voynich Manuscript ay puno ng kakaibang halaman, astronomical diagrams, at mga pigurang tila bahagi ng medical o alchemical text. Ipinangalan ito kay Wilfrid Voynich, ang book dealer na nakakuha nito noong 1912.",
        "Radiocarbon dating sa parchment ang nagtuturo sa unang bahagi ng 1400s. Ibig sabihin, hindi ito modernong internet prank. Pero hindi pa rin malinaw kung tunay na wika, cipher, invented script, o mahusay na panloloko ang laman.",
        "Marami nang nag-anunsyo na 'na-decode' nila ito, mula linguists hanggang computer researchers. Ang problema: kailangang maulit ng iba ang method at maipaliwanag nang consistent ang buong manuscript, hindi lamang ilang salitang napili.",
        "Kung hoax ito, bakit gumawa ang isang tao ng napakahaba at detalyadong aklat? Kung code naman, ano ang pilit nitong itinatago?"
      )
    },
    {
      slug: "uss-cyclops",
      title: "Ang Barkong Naglaho",
      type: "Global mystery",
      text: caption(
        "Mahigit tatlong daang tao ang sakay. Walang distress call. Walang nakitang wreckage. Isang malaking barko ang tila nilamon ng Atlantic.",
        "Noong Marso 1918, umalis ang USS Cyclops mula Barbados patungong Baltimore, may kargang manganese ore. Hindi na ito dumating. Kasama sa pagkawala ang 309 na pasahero at crew, isa sa pinakamalaking non-combat losses sa kasaysayan ng U.S. Navy.",
        "Walang ebidensya ng pag-atake at walang mensaheng humingi ng saklolo. Posibleng kombinasyon ng mabigat na karga, structural weakness, at masamang panahon ang dahilan. Ngunit dahil hindi natagpuan ang barko, hindi ito makumpirma nang buo.",
        "Kalaunan, isinama ang Cyclops sa mga kuwentong Bermuda Triangle. Pero label iyon na sumikat pagkaraan, hindi ebidensya ng paranormal na sanhi.",
        "Kapag walang wreckage, gaano kalakas ang isang practical explanation kumpara sa mas dramatic na theory?"
      )
    }
  ],
  "2026-09-10": [
    {
      slug: "plaza-miranda",
      title: "Sino ang Nasa Likod ng Plaza Miranda?",
      type: "Philippine political mystery",
      text: caption(
        "Dalawang granada ang sumabog sa gitna ng isang political rally. Totoo ang trahedya. Pero makalipas ang mga dekada, pinagtatalunan pa rin kung sino ang nag-utos.",
        "Noong Agosto 21, 1971, inatake ang Liberal Party rally sa Plaza Miranda sa Quiapo. Siyam ang nasawi at marami ang nasugatan, kabilang ang mahahalagang lider ng oposisyon.",
        "Sa unang mga taon, itinuro ng mga kritiko ang administrasyon ni Ferdinand Marcos. Kalaunan, may mga dating kasapi at source na nag-ugnay naman sa Communist Party of the Philippines. May pagtanggi, counterclaim, at magkaibang interpretasyon ng motibo.",
        "Kailangang ihiwalay ang dalawang bagay: dokumentado ang pambobomba at mga biktima; hindi nagkaroon ng iisang court judgment na tuluyang nagsara sa usapin ng mastermind. Kaya hindi responsableng ipakita ang isang theory bilang siguradong katotohanan.",
        "Kapag parehong may political motive ang magkabilang panig, anong uri ng ebidensya ang dapat paniwalaan?"
      )
    },
    {
      slug: "tasaday",
      title: "Tasaday: Tuklas o Panloloko?",
      type: "Philippine anthropology mystery",
      text: caption(
        "Tinawag silang 'Stone Age people' na walang alam sa modernong mundo. Pagbalik ng mga journalist makalipas ang mga taon, iba na ang kanilang nakita.",
        "Noong 1971, ipinakilala sa mundo ang Tasaday sa Mindanao bilang maliit at halos isolated na grupong naninirahan sa kuweba. Naging global sensation sila. Ngunit kontrolado ang access at malapit ang proyekto sa makapangyarihang opisyal noong panahon ng Marcos.",
        "Pagkatapos ng 1986, may bumalik na reporters at nagsabing naka-modernong damit ang ilan at hindi pala lubos na isolated. Sumabog ang accusation na staged ang lahat. Tumutol naman ang ilang anthropologist at sinabing totoong distinct ang grupo, pero pinalabis ang kanilang isolation at pamumuhay.",
        "Ngayon, mas maingat ang pagbasa: hindi kailangang pumili lamang sa 'pure discovery' o 'total hoax.' Posibleng totoong komunidad ang Tasaday na ginawang mas dramatic para sa media at politika.",
        "Kapag ang camera at sponsor ang kumokontrol sa kuwento, gaano karami sa nakikita natin ang totoo?"
      )
    },
    {
      slug: "rizal-ripper",
      title: "Si Rizal Ba si Jack the Ripper?",
      type: "Debunked conspiracy theory",
      text: caption(
        "Nasa London si José Rizal noong 1888. Nang taon ding iyon, gumagala si Jack the Ripper. Sapat na ba ang parehong lungsod at petsa para gawing suspect ang ating pambansang bayani?",
        "Ito ang paboritong recipe ng viral conspiracy: kumuha ng dalawang kilalang pangalan, humanap ng overlap, at punan ng haka-haka ang natitirang puwang. Totoong nag-aral at nanirahan si Rizal sa London. Totoo ring naganap ang Whitechapel murders noong panahong iyon.",
        "Pero walang credible historical evidence na nag-uugnay kay Rizal sa mga krimen. Wala sa kanyang sulat, galaw, kilalang tirahan, o police records ang nagbibigay ng matibay na koneksiyon. Ang pagiging doktor at mahusay gumuhit ay hindi ebidensya ng pagpatay.",
        "Ang coincidence ay magandang simula ng fictional thriller, pero hindi ito proof. Kapag paulit-ulit na ibinahagi ang theory nang walang context, nagmumukha itong history kahit hindi.",
        "Anong ibang conspiracy theory ang gusto mong himayin natin gamit ang dates at dokumentadong facts?"
      )
    },
    {
      slug: "cagsawa",
      title: "Hindi Baon ang Simbahan?",
      type: "Philippine historical myth",
      text: caption(
        "Lumaki tayong naririnig na buong simbahan ang nakabaon sa lupa at bell tower lang ang natira. Pero mas komplikado ang nangyari sa Cagsawa.",
        "Noong Pebrero 1, 1814, sumabog ang Mayon Volcano at winasak ang Cagsawa at mga kalapit na lugar. Totoo ang malaking pinsala at pagkawala ng buhay. Totoo ring nanatiling nakatayo ang bahagi ng bell tower na naging iconic na tanawin.",
        "Ang popular na kuwento ay parang may buo at nakatagong simbahan sa ilalim. Ngunit ipinakita ng historical at archaeological discussion na maaaring hindi ganoon kalalim ang pagkakabaon, at ang istruktura ay winasak ng kombinasyon ng volcanic flows, ash, ulan, at paglipas ng panahon.",
        "Ibig sabihin, hindi peke ang ruins. Ang mito ay ang sobrang simpleng larawan na may kumpletong simbahan sa ilalim na naghihintay lamang hukayin.",
        "Mas nababawasan ba ang ganda ng Cagsawa kapag nalaman nating mas kumplikado ang geology kaysa sa alamat?"
      )
    },
    {
      slug: "dancing-plague",
      title: "Ang Sayaw na Di Mapigil",
      type: "Global historical mystery",
      text: caption(
        "Nagsimula raw sa isang babae. Pagkaraan ng mga araw, marami na ang sumasayaw sa kalsada na tila hindi makapaghinto.",
        "Noong tag-init ng 1518 sa Strasbourg, may mga historical record tungkol sa tinatawag na dancing plague. Iniulat na dumarami ang sumali at nagpatuloy ang kakaibang paggalaw sa loob ng mga linggo.",
        "May mga detalye sa popular retelling na posibleng pinalaki, kabilang ang eksaktong bilang at dami ng namatay. Ngunit sapat ang archival evidence para sabihing may totoong episode ng compulsive dancing na ikinabahala ng mga awtoridad.",
        "Ergot poisoning, religious fear, mass psychogenic illness, at matinding stress dahil sa gutom at sakit ang ilan sa mga paliwanag. Walang single diagnosis na mapatutunayan mula sa limang-daang taong lumang record.",
        "Kung sama-samang takot ang kayang magpakilos sa katawan, hanggang saan ang puwedeng gawin ng isip sa isang buong komunidad?"
      )
    },
    {
      slug: "lead-masks",
      title: "Ang Mga Taong May Lead Mask",
      type: "Global mystery",
      text: caption(
        "Dalawang technician ang nagtungo sa burol. May dala silang kapote, lead masks para sa mata, at note na may eksaktong oras. Hindi na nila naipaliwanag kung bakit.",
        "Noong 1966, natagpuan sa Morro do Vintém sa Brazil sina Miguel José Viana at Manoel Pereira da Cruz. Pareho silang may electronics background. Malapit sa kanila ang kakaibang homemade masks at sulat na tumutukoy sa capsules, oras, at paghihintay sa isang signal.",
        "Walang malinaw na palatandaan ng karaniwang pag-atake, at nahirapang tukuyin ang eksaktong sanhi dahil sa limitasyon ng imbestigasyon. Dahil sa salitang signal at sa masks, pumasok ang theory tungkol sa UFO at paranormal experiment.",
        "Pero theory lang iyon. Posible ring may sinusubukan silang spiritual o technical experiment na may mapanganib na substance. Kulang ang ebidensya para pumili ng final answer.",
        "Para saan sa tingin mo ang lead masks: proteksiyon sa liwanag, bahagi ng ritual, o maling akala sa isang experiment?"
      )
    },
    {
      slug: "vela",
      title: "Ang Vela Flash",
      type: "Global conspiracy mystery",
      text: caption(
        "Isang satellite ang nakakita ng double flash na karaniwang tanda ng nuclear explosion. Ngunit walang bansang umamin at walang opisyal na sagot na tinanggap ng lahat.",
        "Noong Setyembre 22, 1979, na-detect ng U.S. Vela satellite ang maikling dalawang bugso ng liwanag malapit sa southern Indian Ocean. Dinisenyo ang satellite para bantayan ang nuclear tests, kaya seryoso ang alarma.",
        "May theory na lihim itong test, posibleng may kinalaman sa South Africa at Israel. Parehong sensitibo at politically explosive ang claim. Isang U.S. scientific panel naman ang nagmungkahi na maaaring sensor anomaly o natural event ang nakita.",
        "Sa mga sumunod na taon, may environmental at intelligence clues na muling nagpalakas sa nuclear-test interpretation, pero wala pa ring public smoking gun na nagsara sa debate.",
        "Kung classified ang pinakamahalagang records, posible bang magkaroon ang publiko ng final answer?"
      )
    }
  ],
  "2026-09-11": [
    {
      slug: "dacer-corbito",
      title: "Ang Kasong Dacer-Corbito",
      type: "Philippine true crime",
      text: caption(
        "Dinukot sa gitna ng Metro Manila ang isang kilalang publicist at kanyang driver. May mga nahatulan at may mga kasong ibinasura, pero kumpleto na ba ang sagot kung sino ang nasa likod?",
        "Noong Nobyembre 24, 2000, nawala sina Salvador 'Bubby' Dacer at Emmanuel Corbito habang bumibiyahe. Kalaunan, natukoy ang kanilang sinapit at iniugnay ang krimen sa mga kasapi ng Presidential Anti-Organized Crime Task Force.",
        "Nagkaroon ng maraming akusado, testigo, retraction, extradition issue, dismissal, at acquittal. Noong 2017, nahatulan si dating pulis Mauro Torres. Samantala, ang kaso laban kay Panfilo Lacson ay ibinasura at pinagtibay ng Supreme Court noong 2011.",
        "Kaya mahalagang maging eksakto: may legal findings laban sa partikular na tao, ngunit hindi ibig sabihin noon ay napatunayan ang bawat political allegation na ikinabit sa kaso.",
        "Kapag may nahatulang gumawa pero hindi malinaw sa publiko ang buong chain of command, masasabi bang ganap nang nalutas ang krimen?"
      )
    },
    {
      slug: "laguna-copperplate",
      title: "Ang Platong Binago ang Kasaysayan",
      type: "Philippine archaeology mystery",
      text: caption(
        "Hindi ito alamat at hindi rin sulat ng Kastila. Isang manipis na copper plate ang nagpatunay na may dokumentadong lipunan dito noong 900 CE.",
        "Natagpuan ang Laguna Copperplate Inscription noong 1987 malapit sa Lumbang River. Nang mabasa ang Kawi script nito, lumitaw na isa itong dokumento tungkol sa pag-alis o pagbayad ng utang ng isang tao at kanyang pamilya.",
        "May Old Malay, Sanskrit terms, at mga pangalang nag-uugnay sa Luzon sa mas malawak na maritime Southeast Asia. Sa halip na hiwalay at walang sistema, ipinapakita nito ang mundong may batas, utang, ranggo, petsa, at koneksiyon sa ibang pook.",
        "Pero marami pa ring tanong. Saan eksaktong ginawa ang plate? Sino ang sumulat? Gaano kalawak ang authority ng mga pangalang binanggit? Isang document lang ito, kaya napakalaki ng ipinakita at napakalaki rin ng hindi pa natin alam.",
        "Kung may isa pang copperplate na mahahanap bukas, anong bahagi ng precolonial history ang gusto mong masagot nito?"
      )
    },
    {
      slug: "homo-luzonensis",
      title: "Ang Nawalang Tao ng Luzon",
      type: "Philippine science mystery",
      text: caption(
        "Sa loob ng kuweba sa Cagayan, ilang maliliit na buto at ngipin ang nagdagdag ng bagong species sa family tree ng tao.",
        "Sa Callao Cave, nakakita ang mga researcher ng fossils mula sa hindi bababa sa tatlong indibidwal. Noong 2019, pinangalanan nila itong Homo luzonensis dahil sa kakaibang kombinasyon ng features na hindi madaling ipasok sa modern human o ibang kilalang Homo species.",
        "May fossil na may edad na humigit-kumulang 67,000 taon, patunay na napakaaga ng presensiya ng hominin sa Luzon. Ngunit wala pang nakuhang DNA na makapagsasabi kung saan sila nagmula at gaano kalapit ang relasyon nila sa atin o sa ibang archaic humans.",
        "Ang pinakamalaking misteryo ay paano nakarating ang kanilang mga ninuno sa isang islang hindi direktang nakakabit sa mainland kahit mababa ang dagat.",
        "Aksidenteng inanod, may simpleng sasakyang-dagat, o may migration story na hindi pa natin nakikita?"
      )
    },
    {
      slug: "limasawa-butuan",
      title: "Limasawa o Butuan?",
      type: "Philippine historical debate",
      text: caption(
        "Isang pangalan sa lumang journal: Mazaua. Limang siglo na ang lumipas, pinagtatalunan pa rin kung anong modernong lugar iyon.",
        "Ayon sa account ni Antonio Pigafetta, nagdaos ng Easter Sunday Mass ang expedition ni Magellan noong Marso 31, 1521. Sa loob ng mahabang panahon, may mga historyador na iniugnay ang Mazaua sa Butuan, habang itinuro ng iba ang Limasawa sa Southern Leyte.",
        "Sinuri ng mga panel ang coordinates, direksiyon ng paglalayag, island geography, at eyewitness accounts. Noong 2020, muling pinagtibay ng National Historical Commission of the Philippines ang Limasawa bilang site ng First Easter Sunday Mass.",
        "Iyan ang kasalukuyang official historical position. May mga pro-Butuan advocate pa ring hindi sang-ayon, pero ang patuloy na pagtutol ay hindi awtomatikong kapantay ng bagong ebidensya.",
        "Sa historical debate, kailan dapat matapos ang usapan: kapag may official ruling, o kapag wala nang bagong tanong?"
      )
    },
    {
      slug: "tunguska",
      title: "Ang Pagsabog sa Tunguska",
      type: "Global science mystery",
      text: caption(
        "Napakalakas ng pagsabog para patumbahin ang kagubatan sa lawak na mahigit dalawang libong square kilometers. Pero walang malaking impact crater.",
        "Noong Hunyo 30, 1908, may maliwanag na bagay na dumaan sa langit ng Siberia at sumabog sa ibabaw ng Tunguska. Dahil napakalayo ng lugar, mahigit isang dekada bago nakarating ang malaking scientific expedition.",
        "Ang nangibabaw na paliwanag ay airburst: asteroid o comet fragment na sumabog sa atmosphere bago tumama sa lupa. Kaya radial ang pagkatumba ng mga puno at walang klasikong crater na inaasahan sa isang solid impact.",
        "Ang kawalan ng crater ang nagpakain sa theories tungkol sa antimatter, black hole, at alien spacecraft. Wala sa mga iyon ang may ebidensyang mas malakas kaysa sa cosmic airburst model.",
        "Kung nangyari ito sa ibabaw ng modernong lungsod, gaano kalaking pinsala ang magagawa ng bagay na hindi man lang umabot sa lupa?"
      )
    },
    {
      slug: "cicada-3301",
      title: "Sino ang Cicada 3301?",
      type: "Global internet mystery",
      text: caption(
        "Nagsimula ito sa isang simpleng larawan online: 'Naghahanap kami ng highly intelligent individuals.' Pagkatapos, dinala ng puzzle ang solvers sa cryptography, hidden websites, libro, musika, at totoong lokasyon.",
        "Noong Enero 2012, lumitaw ang unang Cicada 3301 puzzle sa 4chan. May sumunod na rounds noong 2013 at 2014. Gumamit ang grupo ng steganography, ciphers, phone numbers, at PGP signatures para patunayan kung alin ang tunay na mensahe nila.",
        "May ilang solver na umabot sa private stages, pero walang napatunayang identity ng organizer. Recruitment ba ito para sa intelligence agency, privacy collective, cybersecurity group, o napakagaling na alternate-reality game? Lahat ay theory.",
        "Ang huling verified message ay nagbabala laban sa mga pekeng puzzle na gumagamit ng kanilang pangalan. Ibig sabihin, kahit ang katahimikan nila ay kailangang i-authenticate.",
        "Kung maabot mo ang huling level, sasali ka ba sa grupong ayaw magpakilala?"
      )
    },
    {
      slug: "antwerp-heist",
      title: "Ang Heist na Tinalo ang 10 Security Layers",
      type: "Global true crime",
      text: caption(
        "May infrared detector, seismic sensor, magnetic field, radar, at lock na may milyon-milyong kombinasyon. Pagbukas ng vault, wala pa rin ang mga diyamante.",
        "Noong weekend ng Pebrero 2003, pinasok ng grupo ng magnanakaw ang vault ng Antwerp Diamond Center sa Belgium. Tinatayang lampas $100 milyon ang nawalang diamonds, gold, cash, at iba pang valuables.",
        "Naaresto ang Italian thief na si Leonardo Notarbartolo at ilang kasamahan matapos may makitang ebidensya sa itinapong basura. Pero kahit may convictions, hindi nabawi ang malaking bahagi ng loot at hindi lubos na naipaliwanag sa publiko ang bawat paraan ng pag-bypass sa security.",
        "Kalaunan, sinabi ni Notarbartolo na mas maliit ang totoong halaga at bahagi raw ito ng insurance scheme. Hindi napatunayan ang bersyon niyang iyon.",
        "Ano ang mas malaking pagkakamali: ang teknikal na security, o ang isang bag ng basurang nagdala sa pulis sa mga suspect?"
      )
    }
  ],
  "2026-09-12": [
    {
      slug: "tondo-conspiracy",
      title: "Ang Lihim na Balak ng Tondo",
      type: "Philippine historical conspiracy",
      text: caption(
        "Mahigit tatlong daang taon bago ang Katipunan, may lihim nang planong patalsikin ang mga Kastila sa Manila. Hindi ito theory. Nasa colonial records ang sabwatan.",
        "Noong 1587 hanggang 1588, ilang Tagalog nobles mula Tondo at karatig na lugar ang nagplano ng pag-aalsa. Kabilang sa mga pangalang lumitaw sina Agustin de Legazpi, Martin Pangan, at Magat Salamat.",
        "Nais nilang humingi ng tulong mula sa mga puwersa sa labas, kabilang ang Brunei at Japan, habang kikilos ang mga kaalyado sa Luzon. Ngunit hindi umabot sa aktuwal na malawakang pag-aalsa ang plano. Nabunyag ito matapos ipagkanulo ng isang taong pinagkatiwalaan ang detalye sa mga opisyal ng kolonya.",
        "Sumunod ang mga pag-aresto, paglilitis, pagbitay, at pagpapatapon. Ang conspiracy ay nabigo, pero ipinakita nitong maagang-maaga pa lang ay may organisadong pagtutol na sa kolonyal na kapangyarihan.",
        "Kung hindi nabunyag ang lihim, posible kayang nagbago ang kasaysayan ng Manila?"
      )
    },
    {
      slug: "tallano-gold",
      title: "Ang Alamat ng Tallano Gold",
      type: "Debunked conspiracy theory",
      text: caption(
        "Sinasabing may royal family na nagmay-ari ng halos buong Pilipinas at nag-ipon ng napakaraming ginto. Ang problema: walang credible historical record na sumusuporta rito.",
        "Kumalat online ang Tallano Gold story sa iba't ibang bersyon. May secret kingdom daw na Maharlika, may legal service na binayaran ng gold, at may kayamanang ipamamahagi sa mga Pilipino kapag dumating ang tamang panahon.",
        "Kapag sinuri ang dates, land records, court claims, at kilalang kasaysayan ng kolonyal na Pilipinas, hindi nagtutugma ang kuwento. Wala ring authenticated document na nagpapatunay sa sinasabing lawak ng lupain o gold reserve.",
        "Mahalagang distinction: totoong may ginto at precolonial trade sa kapuluan. Totoo ring may yamang nakatagong o narekober sa iba't ibang kaso. Pero hindi iyon patunay ng Tallano narrative.",
        "Bakit madaling paniwalaan ang ganitong kuwento: dahil ba sa pag-asa, galit sa inequality, o sa dami ng paulit-ulit na posts?"
      )
    },
    {
      slug: "operation-big-bird",
      title: "Operation Big Bird",
      type: "Philippine political mystery",
      text: caption(
        "May access daw sa $213 milyon sa Swiss bank. May deadline. May utos na maglipat. Pagkatapos, umatras ang operasyon at nagsimula ang sisihan.",
        "Noong 1986, matapos ang People Power Revolution, inilunsad ang tinawag na Operation Big Bird para subukang mahanap at mabawi ang mga account na inuugnay kay Ferdinand Marcos at kanyang pamilya. Kasama sa plano ang banker na si Michael de Guzman at mga kinatawan ng bagong pamahalaan.",
        "Ayon sa isang bersyon, malapit nang mailipat ang $213 milyon nang pigilan ang proseso dahil sa pangambang mapunta ang pera sa maling account. Ayon sa kabilang bersyon, delikado at kulang sa proteksiyon ang arrangement. Nagkaroon ng magkakaibang congressional at personal accounts kung sino ang nagkamali.",
        "Hindi ibig sabihin na tuluyang nawala ang lahat. Sa hiwalay at mas mahabang legal process, daan-daang milyong dolyar mula sa Swiss deposits ang kalaunang nailipat sa Philippine government matapos ang mga desisyon ng korte.",
        "Nailigtas ba ng pag-iingat ang pera, o nawala ang mas mabilis na pagkakataon?"
      )
    },
    {
      slug: "golden-tara",
      title: "Bakit Nasa Chicago ang Gintong Tara?",
      type: "Philippine heritage mystery",
      text: caption(
        "Natagpuan sa Agusan ang halos dalawang kilong gintong estatwa. Pero para makita ang original ngayon, kailangan mong pumunta sa Chicago.",
        "Noong 1917, natagpuan ang tinatawag na Golden Tara o Agusan Image malapit sa Wawa River. Gawa ito sa high-karat gold at nagpapakita ng malalim na koneksiyon ng precolonial Philippines sa mga kulturang Hindu-Buddhist ng Southeast Asia.",
        "Sa panahon ng American colonial rule, napunta ang artifact sa commercial hands. Hindi ito nabili ng Philippine institution at kalauna'y nakuha ng Field Museum, kung saan nananatili itong naka-display.",
        "Madalas itanong kung ninakaw ba ito. Mas eksakto ang sagot: may documented chain ng pagbili, ngunit nangyari iyon sa kolonyal na kontekstong limitado ang kakayahan ng bansa na panatilihin ang sarili nitong heritage. Legal ownership at moral ownership ay hindi laging pareho.",
        "Dapat bang ibalik ang Golden Tara sa Agusan, ipahiram nang matagal, o manatili sa museum na nag-ingat dito?"
      )
    },
    {
      slug: "yuba-five",
      title: "Ang Yuba County Five",
      type: "Global missing-persons mystery",
      text: caption(
        "Nanonood lang sila ng basketball. Kinabukasan, may laro rin silang hinihintay. Pero sa halip na umuwi, napunta ang kanilang kotse sa malayong snowy mountain road.",
        "Noong Pebrero 24, 1978, limang magkakaibigang lalaki mula Yuba County, California ang umalis sa isang college basketball game. Makalipas ang ilang araw, natagpuan ang kanilang kotse sa Plumas National Forest, malayo sa normal na ruta pauwi at hindi lubhang sira.",
        "Nang matunaw ang snow, natagpuan ang apat sa kanila sa iba't ibang bahagi ng wilderness. Si Gary Mathias ay hindi kailanman natagpuan. May shelter na may pagkain at paraan para magpainit, ngunit kakaunti lamang ang nagamit.",
        "May intellectual disabilities o mental-health condition ang ilan, pero hindi iyon paliwanag sa lahat ng desisyon nila at hindi dapat gawing insulto o simpleng dahilan. Ang tanong ay bakit sila pumunta roon at bakit nila iniwan ang kotse.",
        "Naliligaw ba sila, may iniiwasan, o may nangyaring hindi naitala?"
      )
    },
    {
      slug: "taos-hum",
      title: "Ang Hum na Iilan Lang ang Nakakarinig",
      type: "Global science mystery",
      text: caption(
        "Tahimik ang gabi sa Taos, New Mexico. Pero para sa ilang residente, may mababang ugong na hindi tumitigil at hindi marinig ng katabi nila.",
        "Noong early 1990s, naging kilala ang reklamo tungkol sa Taos Hum. Inilarawan itong parang malayong diesel engine o rumble. Nakakagulat, maliit na bahagi lamang ng populasyon ang nagsabing naririnig nila ito.",
        "Gumamit ang mga researcher mula sa ilang laboratory at university ng acoustic, seismic, at electromagnetic instruments. Wala silang natukoy na iisang external signal na kayang ipaliwanag ang lahat ng reports.",
        "May theories tungkol sa industrial equipment, infrasound, geological activity, at tinnitus o ibang internal auditory effect. Ang secret military experiment ay popular online, pero walang public evidence na nagpapatunay nito.",
        "Kung tunay ang tunog para sa nakakarinig pero hindi masukat sa parehong paraan, nasa paligid ba ang source o nasa paraan ng pagproseso ng utak?"
      )
    },
    {
      slug: "maple-syrup",
      title: "Ang Great Maple Syrup Heist",
      type: "Global true crime",
      text: caption(
        "Hindi bangko ang pinasok. Walang diyamante sa vault. Ang ninakaw ay libo-libong tonelada ng maple syrup na halos kasinghalaga ng ginto.",
        "Mula 2011 hanggang 2012, unti-unting nawala ang malaking bahagi ng strategic maple syrup reserve sa Quebec, Canada. Tinatayang 2,700 tonelada ang kinuha at humigit-kumulang C$18.7 milyon ang halaga.",
        "Hindi agad napansin dahil nasa libo-libong barrels ang stock at hindi araw-araw iniinspeksiyon. May mga barrel na inalis ang laman, ang iba'y pinalitan ng tubig, at ang syrup ay ibinenta sa lehitimong market sa pamamagitan ng magkakahiwalay na ruta.",
        "Nahuli ang grupo at nagkaroon ng convictions. Pero ang pinakaabsurd na twist ay totoo ang dahilan kung bakit may reserve: napakalaki ng bahagi ng Quebec sa world maple syrup supply kaya kailangang kontrolin ang sobrang ani at presyo.",
        "Kung ikaw ang inspector, maghihinala ka bang ang magaan na barrel ay simula ng pinakamalaking syrup heist sa kasaysayan?"
      )
    }
  ]
};

const posts = Object.entries(days).flatMap(([date, items]) => {
  if (items.length !== 7) throw new Error(`${date} must have exactly seven posts`);
  return items.map((item, index) => ({
    id: `ptp-${date}-${item.slug}`,
    title: item.title,
    type: item.type,
    text: item.text,
    imagePath: `content/images/${date}-${item.slug}.jpg`,
    publishAt: `${date}T${dailyTimes[index]}+08:00`,
    status: "queued"
  }));
});

if (posts.length !== 42) throw new Error(`Expected 42 posts, found ${posts.length}`);
if (posts.some((post) => /Larawan:|visual reconstruction|source:/i.test(post.text))) {
  throw new Error("A prohibited disclosure or source label is present in a caption");
}

await fs.writeFile("content/batch-2026-09-07-to-12.json", `${JSON.stringify(posts, null, 2)}\n`, "utf8");
console.log(`Wrote ${posts.length} posts.`);
