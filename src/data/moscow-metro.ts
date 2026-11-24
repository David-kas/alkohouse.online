export type MetroStation = {
  id: string;
  name: string;
  line: string;
  lineColor: string;
  hint: string;
};

export const METRO_STATIONS: MetroStation[] = [
  { id: "arbatskaya", name: "Арбатская", line: "Арбатско-Покровская", lineColor: "#0078BE", hint: "Центр: уточните подъезд и домофон." },
  { id: "teatralnaya", name: "Театральная", line: "Замоскворецкая", lineColor: "#44B85C", hint: "Пешеходный центр, возможны ограничения въезда." },
  { id: "taganskaya", name: "Таганская", line: "Таганско-Краснопресненская", lineColor: "#894E35", hint: "Удобная точка на Taganka." },
  { id: "dobryninskaya", name: "Добрынинская", line: "Кольцевая", lineColor: "#894E35", hint: "Кольцо, связка с Павелецким вокзалом." },
  { id: "kievskaya", name: "Киевская", line: "Кольцевая", lineColor: "#894E35", hint: "Узловая станция на западе." },
  { id: "park-kultury", name: "Парк культуры", line: "Кольцевая", lineColor: "#894E35", hint: "Центральный парк и Пречистенка." },
  { id: "yasenevo", name: "Ясенево", line: "Калужско-Рижская", lineColor: "#F07E24", hint: "Юго-запад, спальный массив." },
  { id: "konkovo", name: "Коньково", line: "Калужско-Рижская", lineColor: "#F07E24", hint: "ЮЗАО, рядом с Научным." },
  { id: "ramenki", name: "Раменки", line: "Калужско-Рижская", lineColor: "#F07E24", hint: "Запад, МГУ и проспект Вернадского." },
  { id: "sokol", name: "Сокол", line: "Замоскворецкая", lineColor: "#44B85C", hint: "Север, Ленинградка." },
  { id: "aeroport", name: "Аэропорт", line: "Замоскворецкая", lineColor: "#44B85C", hint: "Деловой северный кластер." },
  { id: "vladykino", name: "Владыкино", line: "Серпуховско-Тимирязевская", lineColor: "#A1A2A3", hint: "СВАО, пересадка на МЦК." },
  { id: "botanicheskiy-sad", name: "Ботанический сад", line: "Калужско-Рижская", lineColor: "#F07E24", hint: "Северо-восток, парк и МЦК." },
  { id: "shchelkovskaya", name: "Щёлковская", line: "Арбатско-Покровская", lineColor: "#0078BE", hint: "Восток, Щёлковское шоссе." },
  { id: "lyublino", name: "Люблино", line: "Люблинско-Дмитровская", lineColor: "#B3D445", hint: "ЮВАО, наземный переход на вторую ветку." },
  { id: "marino", name: "Марьино", line: "Люблинско-Дмитровская", lineColor: "#B3D445", hint: "Крупный жилой массив на юге." },
  { id: "delovoy-centr", name: "Деловой центр", line: "Большая кольцевая", lineColor: "#82C0C0", hint: "Москва-Сити, укажите башню и вход." },
  { id: "kutuzovskaya", name: "Кутузовская", line: "Филёвская", lineColor: "#B1D332", hint: "Кутузовский проспект, запад." },
  { id: "paveletskaya", name: "Павелецкая", line: "Замоскворецкая", lineColor: "#44B85C", hint: "Вокзал и набережные." },
  { id: "krasnoselskaya", name: "Красносельская", line: "Сокольническая", lineColor: "#EF1E25", hint: "Северо-восток центра." },
];