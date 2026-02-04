// Bancos de dados de nomes
const maleNames = [
  "Miguel", "Arthur", "Gael", "Théo", "Heitor", "Ravi", "Davi", "Bernardo", "Noah", "Gabriel",
  "Samuel", "Pedro", "Anthony", "Isaac", "Benício", "Benjamin", "Matheus", "Lucas", "Joaquim", "Nicolas",
  "Lucca", "Henrique", "Bryan", "João", "Rafael", "Daniel", "Enzo", "Léo", "Bento", "Vicente",
  "Eduardo", "Pedro Henrique", "Leonardo", "Vitor", "José", "João Pedro", "Pietro", "Davi Lucca", "Felipe", "Calebe",
  "Francisco", "Antônio", "Vinícius", "Enrico", "João Miguel", "Davi Lucas", "Noah", "João Gabriel", "João Lucas", "Luiz",
  "Cauã", "Caio", "Antônio", "Augusto", "Levi", "Yuri", "Tomás", "Francisco", "Ian", "Breno",
  "Bruno", "Otávio", "José", "Ruan", "Tomás", "Calebe", "Guilherme", "João Vitor", "Luiz Miguel", "Bento",
  "Davi Miguel", "João Guilherme", "Nathan", "Pedro Lucas", "Emmanuel", "Vitor Hugo", "Enzo Gabriel", "Luiz Felipe", "Ryan", "Arthur Miguel",
  "João Paulo", "Pedro Miguel", "Davi Luiz", "Luan", "Diego", "Fábio", "Alexandre", "André", "Carlos", "Marcos",
  "Ricardo", "Renato", "Willian", "Roberto", "Sérgio", "Fernando", "Cláudio", "Márcio", "Jorge", "Igor",
  "Marcelo", "Leandro", "Tiago", "Anderson", "Rodrigo", "Pablo", "Diogo", "Fagner", "Júlio", "Gilberto",
  "Renan", "Douglas", "Wagner", "Everton", "Jeferson", "Ronaldo", "Adriano", "Cristiano", "Danilo", "Murilo",
  "César", "Fabrício", "Maurício", "Reginaldo", "Robson", "Sidnei", "Valdir", "Vanderlei", "Wesley", "Alisson",
  "Breno", "Denis", "Edson", "Elias", "Gerson", "Hélio", "Ícaro", "Jonas", "Kleber", "Luciano",
  "Maikon", "Nilton", "Osvaldo", "Paulo", "Queiroz", "Raul", "Saulo", "Tales", "Ubirajara", "Valmir",
  "Wallace", "Xavier", "Yago", "Zeca", "Abel", "Breno", "Caíque", "Dálton", "Erick", "Fausto",
  "Glauco", "Hugo", "Ivan", "Jaime", "Kevin", "Laércio", "Michel", "Nivaldo", "Olavo", "Patrick",
  "Quintino", "Ramon", "Silvio", "Túlio", "Ulisses", "Valter", "Washington", "Xande", "Yuri", "Zaqueu",
  "Adalberto", "Batista", "Cicero", "Damião", "Edmilson", "Firmino", "Genival", "Hamilton", "Ismael", "Jair",
  "Kauan", "Lázaro", "Manoel", "Narciso", "Odair", "Pascoal", "Quirino", "Rubens", "Severino", "Tarcísio",
  "Ueliton", "Vagner", "Wilson", "Xisto", "Yan", "Zenon", "Aldo", "Bernad", "Cosme", "Dantas"
];

const femaleNames = [
  "Helena", "Alice", "Laura", "Maria Alice", "Sophia", "Manuela", "Maitê", "Liz", "Cecília", "Isabella",
  "Luísa", "Eloá", "Heloísa", "Júlia", "Ayla", "Maria Luísa", "Isis", "Elisa", "Antonella", "Maria Júlia",
  "Maya", "Maria Clara", "Maria Cecília", "Lívia", "Esther", "Giovanna", "Sarah", "Maria Helena", "Lorena", "Beatriz",
  "Maria Liz", "Marina", "Melissa", "Isadora", "Mirella", "Lavínia", "Alana", "Lara", "Ana Laura", "Catarina",
  "Luna", "Yasmin", "Emanuelly", "Rebeca", "Ana Clara", "Clara", "Ana Júlia", "Valentina", "Ana Luísa", "Agatha",
  "Olívia", "Vitória", "Maria", "Mariana", "Juliana", "Gabriela", "Rafaela", "Bruna", "Camila", "Fernanda",
  "Amanda", "Letícia", "Bianca", "Larissa", "Luana", "Débora", "Laís", "Eduarda", "Brenda", "Natália",
  "Carolina", "Vanessa", "Priscila", "Jéssica", "Tatiane", "Roberta", "Patrícia", "Renata", "Michele", "Cristiane",
  "Adriana", "Aline", "Daiane", "Elaine", "Flávia", "Gisele", "Hosana", "Iara", "Janaina", "Karina",
  "Lorena", "Monique", "Naiara", "Paloma", "Quezia", "Raquel", "Sabrina", "Talita", "Ursula", "Viviane",
  "Wanessa", "Ximena", "Yara", "Zilma", "Alessandra", "Bárbara", "Carla", "Daniela", "Erika", "Fabiana",
  "Gislaine", "Heloisa", "Ingrid", "Jaqueline", "Kátia", "Leandra", "Marcela", "Nicole", "Odete", "Paula",
  "Quitéria", "Rita", "Sandra", "Tânia", "Ulyssa", "Valéria", "Wanda", "Xuxa", "Yasmin", "Zuleide",
  "Abigail", "Berenice", "Clarice", "Dalila", "Elza", "Fátima", "Glória", "Hilda", "Iracema", "Joana",
  "Kelly", "Lurdes", "Madalena", "Neusa", "Ofélia", "Pietra", "Quênia", "Rosa", "Simone", "Tereza",
  "Vera", "Wilma", "Xênia", "Yolanda", "Zenaide", "Anita", "Betina", "Célia", "Dora", "Eva",
  "Flora", "Graça", "Helga", "Inês", "Jussara", "Karen", "Lia", "Mara", "Nair", "Olga",
  "Pâmela", "Sara", "Telma", "Vânia", "Zélia", "Áurea", "Bia", "Cíntia", "Dóris", "Eunice",
  "Francisca", "Gema", "Hortência", "Ivone", "Jandira", "Lúcia", "Marta", "Noêmia", "Otávia", "Penélope"
];

const middleAbbrs = [
  "A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.", "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z.",
  "da", "de", "do", "das", "dos", "e",
  "Alv.", "Bar.", "Car.", "Dia.", "Est.", "Fer.", "Gon.", "Hen.", "Iná.", "Jes.", "Kel.", "Lim.", "Mar.", "Nun.", "Oli.", "Per.", "Que.", "Rib.", "San.", "Tei.",
  "A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.", "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z.",
  "Ag.", "Ba.", "Co.", "Du.", "Ev.", "Fa.", "Go.", "Hi.", "Io.", "Ju.", "Ki.", "Le.", "Ma.", "No.", "Ol.", "Pa.", "Qu.", "Ro.", "Sa.", "To.", "Ul.", "Vi.", "Xa.", "Ya.", "Ze.",
  "S.", "M.", "P.", "J.", "A.", "C.", "R.", "L.", "F.", "G.",
  "Jr.", "Neto", "Filho", "Sob.",
  "Ap.", "Cris.", "Dan.", "Ed.", "Fab.", "Gab.", "Hel.", "Isa.", "Jo.", "Ka.", "La.", "Ma.", "Nat.", "Ot.", "Pat.", "Raf.", "Sam.", "Tat.", "Val.", "Wel.",
  "Al.", "Be.", "Ca.", "Da.", "El.", "Fe.", "Gu.", "He.", "Is.", "Ja.", "Ke.", "Lu.", "Mi.", "Ni.", "Or.", "Pi.", "Ro.", "Si.", "Ti.", "Va.",
  "A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.", "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z.",
  "S.", "M.", "P.", "J.", "da", "de"
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes",
  "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa",
  "Rocha", "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas",
  "Cardoso", "Ramos", "Gonçalves", "Reis", "Teixeira", "Borges", "Mattos", "Coelho", "Duarte", "Melo",
  "Henrique", "Cardoso", "Batista", "Pinto", "Moura", "Cavalcanti", "Braga", "Campos", "Siqueira", "Barros",
  "Miranda", "Franco", "Macedo", "Batista", "Carneiro", "Farias", "Moraes", "Fogaça", "Ruschi", "Pacheco",
  "Monteiro", "Peixoto", "Benevides", "Lemos", "Quintana", "Castelo", "Aragão", "Pinheiro", "Guerra", "Navarro",
  "Brandão", "Figueiredo", "Muniz", "Neves", "Serrano", "Aquino", "Viana", "Brito", "Sales", "Silveira",
  "Lins", "Antunes", "Maciel", "Dantas", "Junqueira", "Xavier", "Cunha", "Guimarães", "Nogueira", "Rezende",
  "Pires", "Lacerda", "Chaves", "Medeiros", "Vasconcelos", "Fontes", "Aguiar", "Padilha", "Guedes", "Correia",
  "Furtado", "Assis", "Bernardes", "Bentes", "Câmara", "Domingues", "Esteves", "Falcão", "Galvão", "Hipólito",
  "Igreja", "Jordão", "Kruger", "Luz", "Meneses", "Nóbrega", "Ornelas", "Paz", "Queirós", "Rangel",
  "Sampaio", "Tavares", "Uchoa", "Valente", "Werneck", "Ximenes", "Yoshida", "Zamboni", "Azevedo", "Bueno",
  "Camargo", "Drummond", "Evangelista", "Fagundes", "Gimenes", "Holanda", "Inácio", "Jesus", "Klein", "Leal",
  "Maia", "Napoleão", "Outeiro", "Prado", "Quadros", "Resende", "Salazar", "Toledo", "Ustra", "Velasco",
  "Wanderley", "Xavier", "Yamamoto", "Zanetti", "Albuquerque", "Barreto", "Couto", "Diniz", "Espinosa", "Feitosa",
  "Godoy", "Herculano", "Imperial", "Jardim", "Kaiser", "Lobato", "Malta", "Noronha", "Omena", "Porto",
  "Queiroz", "Ramalho", "Santiago", "Torres", "Urbano", "Vila", "Weiss", "Xisto", "Yan", "Zago",
  "Abrantes", "Bastos", "Caldelas", "Dutra", "Evaristo", "Fonseca", "Gentil", "Haddad", "Isidoro", "Justo",
  "Kobayashi", "Longo", "Matos", "Nascimento", "Onofre", "Paiva", "Quaresma", "Rios", "Saraiva", "Teles",
  "Urtiga", "Vidal", "Walter", "Ximenes", "Young", "Zanella", "Amaral", "Botelho", "Castilho", "Domenico",
  "Estrada", "Félix", "Gama", "Hernandes", "Ibrahim", "Jovino", "Kuster", "Lourenço", "Meireles", "Novaes",
  "Orosco", "Pessanha", "Queiroga", "Rabelo", "Severo", "Trindade", "Utsch", "Ventura", "Weber", "Xavier",
  "Yamada", "Zimmermann", "Arruda", "Beltrão", "Cordeiro", "Dalla", "Elias", "Frota", "Goulart", "Hertel",
  "Ilha", "Jales", "Kuhn", "Lustosa", "Milani", "Nery", "Oliveto", "Pimentel", "Quintanilha", "Rebouças",
  "Salomão", "Tristão", "Ulhoa", "Varela", "Wolff", "Xavier", "Yunes", "Zanon", "Ávila", "Bicalho",
  "Cerqueira", "Delgado", "Eler", "Fraga", "Garcez", "Hoffmann", "Inocêncio", "Jobim", "Koch", "Lira",
  "Marinho", "Negrão", "Olimpio", "Pontes", "Quintino", "Ribeiro", "Souto", "Tamanini", "Uemura", "Vargas",
  "Wagner", "Xavier", "Yoo", "Zardo", "Assunção", "Belmonte", "Cortez", "Diegues", "Escobar", "Floresta",
  "Garcia", "Heck", "Iório", "Junqueira", "Krieger", "Loureiro", "Mansur", "Noleto", "Otoni", "Proença",
  "Queirolo", "Roquete", "Scarpim", "Taveira", "Uguento", "Vianna", "Watanabe", "Xavier", "Yamaguchi", "Zattar",
  "Arantes", "Bulhões", "Coutinho", "Dallagnol", "Espirito Santo", "Faustino", "Gusmão", "Hilario", "Imbassahy", "Jatobá",
  "Kronemberger", "Lamego", "Magalhães", "Nogueira", "Orsini", "Peralta", "Queirós", "Rossi", "Schmitt", "Toscano"
];

// Estado global para garantir que na sessão atual os nomes não se repitam
const usedCombinations = new Set<string>();

export const generateUniqueIdentity = (gender?: 'male' | 'female') => {
  let firstName = "";
  let nameList = maleNames; // default

  if (gender === 'female') {
    nameList = femaleNames;
  } else if (!gender) {
    nameList = Math.random() > 0.5 ? maleNames : femaleNames;
  }

  // Tentar gerar um nome único (limite de tentativas para evitar loop infinito se esgotar)
  let attempts = 0;
  let fullName = "";
  
  do {
    const first = nameList[Math.floor(Math.random() * nameList.length)];
    const middle = middleAbbrs[Math.floor(Math.random() * middleAbbrs.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    fullName = `${first} ${middle} ${last}`;
    attempts++;
  } while (usedCombinations.has(fullName) && attempts < 100);

  usedCombinations.add(fullName);
  return fullName;
};

// Exportar listas para uso externo se necessário (ex: Testimonials)
export { maleNames, femaleNames, lastNames };