export interface Podcast {
  title: string;
  author?: string;
  id: string;
  artwork?: string;
  backgroundColor: string;
  isCompleted: boolean;
  progress: number;
  timeLeft: string;
}

export interface DiscoverPodcast extends Pick<
  Podcast,
  "title" | "author" | "id" | "artwork"
> {}

export interface SearchPodcast extends Pick<
  Include<Podcast, "rating", number>,
  "title" | "author" | "id" | "artwork" | "rating"
> {}

const HEADING_PODCASTS: Podcast[] = [
  {
    title: "Steve Jobs",
    artwork: "https://m.media-amazon.com/images/I/51b8AJgZETL._SL500_.jpg",
    author: "Walter Isaacson",
    id: "steve_jobs_walter_isaacson_1",
    backgroundColor: "#d1d1d1",
    isCompleted: false,
    progress: 0.5,
    timeLeft: "14m",
  },
  {
    title: "Make Time",
    author: "Jake Knapp",
    id: "make_time_jake_knapp_and_john_zeratsky_2",
    artwork: "https://piyushsurana.com/wp-content/uploads/2024/04/headline.png",
    backgroundColor: "#f9ec9e",
    isCompleted: false,
    progress: 0.2,
    timeLeft: "32m",
  },
];

const DISCOVER_PODCASTS: DiscoverPodcast[] = [
  {
    id: "james_clear_atomic_habits",
    title: "Atomic Habits",
    author: "James Clear",
    artwork:
      "https://m.media-amazon.com/images/I/817HaeblezL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: "morgan_housel_psychology_of_money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    artwork:
      "https://m.media-amazon.com/images/I/71TRUbzcvaL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "paulo_coelho_the_alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    artwork:
      "https://m.media-amazon.com/images/I/71aFt4+OTOL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "robert_kiyosaki_rich_dad_poor_dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    artwork:
      "https://m.media-amazon.com/images/I/81bsw6fnUiL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "mark_manson_subtle_art",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    artwork:
      "https://m.media-amazon.com/images/I/71QKQ9mwV7L._UF1000,1000_QL80_.jpg",
  },
  {
    id: "george_orwell_1984",
    title: "1984",
    author: "George Orwell",
    artwork:
      "https://m.media-amazon.com/images/I/71kxa1-0mfL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "cal_newport_deep_work",
    title: "Deep Work",
    author: "Cal Newport",
    artwork:
      "https://m.media-amazon.com/images/I/71g2ednj0JL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "jrr_tolkien_hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    artwork:
      "https://m.media-amazon.com/images/I/91b0C2YNSrL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "yuval_noah_harari_sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    artwork:
      "https://m.media-amazon.com/images/I/713jIoMO3UL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "stephen_covey_7_habits",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    artwork:
      "https://m.media-amazon.com/images/I/71rmHeQeuRL._AC_UF1000,1000_QL80_DpWeblab_.jpg",
  },
  {
    id: "napoleon_hill_think_and_grow_rich",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    artwork:
      "https://m.media-amazon.com/images/I/71UypkUjStL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "eric_berne_games_people_play",
    title: "Games People Play",
    author: "Eric Berne",
    artwork:
      "https://m.media-amazon.com/images/I/81VStYnDGrL._UF1000,1000_QL80_.jpg",
  },
];

const SEARCH_PODCAST: SearchPodcast[] = [
  {
    artwork:
      "https://m.media-amazon.com/images/I/91QwfKeVsfL._AC_UF1000,1000_QL80_.jpg",
    id: "lolita_vladimir_nabokov",
    title: "Lolita",
    author: "Vladimir Nabokov",
    rating: 4.2,
  },
  {
    artwork:
      "https://m.media-amazon.com/images/I/81WcnNQ-TBL._UF1000,1000_QL80_.jpg",
    id: "the_secret_history_donna_tartt",
    title: "The Secret History",
    author: "Donna Tartt",
    rating: 4.4,
  },
  {
    artwork:
      "https://m.media-amazon.com/images/I/71aFt4+OTOL._UF1000,1000_QL80_.jpg",
    id: "the_alchemist_paulo_coelho",
    title: "The Alchemist",
    author: "Paulo Coelho",
    rating: 4.6,
  },
  {
    artwork:
      "https://m.media-amazon.com/images/I/81s6DUyQCZL._UF1000,1000_QL80_.jpg",
    id: "norwegian_wood_haruki_murakami",
    title: "Norwegian Wood",
    author: "Haruki Murakami",
    rating: 4.3,
  },
  {
    artwork:
      "https://m.media-amazon.com/images/I/81t2CVWEsUL._UF1000,1000_QL80_.jpg",
    id: "if_we_were_villains_ml_rio",
    title: "If We Were Villains",
    author: "M.L. Rio",
    rating: 4.1,
  },
  {
    artwork:
      "https://m.media-amazon.com/images/I/71N2HZwRo3L._UF1000,1000_QL80_.jpg",
    id: "the_bell_jar_sylvia_plath",
    title: "The Bell Jar",
    author: "Sylvia Plath",
    rating: 4.0,
  },
  {
    artwork:
      "https://m.media-amazon.com/images/I/81vpsIs58WL._UF1000,1000_QL80_.jpg",
    id: "call_me_by_your_name_andre_aciman",
    title: "Call Me By Your Name",
    author: "André Aciman",
    rating: 4.5,
  },
  {
    artwork: "https://m.media-amazon.com/images/I/41y8H3QmVqL.jpg",
    id: "white_nights_fyodor_dostoevsky",
    title: "White Nights",
    author: "Fyodor Dostoevsky",
    rating: 4.4,
  },
];
export { DISCOVER_PODCASTS, HEADING_PODCASTS, SEARCH_PODCAST };
