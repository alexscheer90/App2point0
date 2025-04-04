import { LocalEats } from "@shared/schema";

// This data would ideally come from an API, but for demo purposes
// we're hard-coding the local restaurant recommendations near MAC schools
export const macLocalEats: LocalEats[] = [
  // Akron
  {
    id: "luigis-akron",
    schoolId: "akron",
    name: "Luigi's Restaurant",
    cuisine: "Italian",
    description: "A beloved Akron institution since 1949, Luigi's is famous for its pizza and Italian dishes. The casual, no-frills atmosphere and reasonable prices make it a favorite among students.",
    address: "105 N Main St, Akron, OH 44308",
    websiteUrl: "https://www.luigisrestaurant.com/",
    rating: 4.7,
    distanceFromCampus: "0.8 miles"
  },
  {
    id: "diamond-deli-akron",
    schoolId: "akron",
    name: "Diamond Deli",
    cuisine: "Deli/Sandwiches",
    description: "Known for its oversized sandwiches named after Akron landmarks, Diamond Deli offers fresh ingredients and friendly service. Their homemade soups and sides complement their signature sandwiches perfectly.",
    address: "378 S Main St, Akron, OH 44311",
    rating: 4.6,
    distanceFromCampus: "0.5 miles"
  },
  
  // Ball State
  {
    id: "greekos-muncie",
    schoolId: "ballstate",
    name: "Greek's Pizzeria",
    cuisine: "Pizza",
    description: "A Muncie staple, Greek's serves hand-crafted pizzas with a signature thin crust. Their breadsticks with cheese are a must-try for any Ball State student.",
    address: "1600 W University Ave, Muncie, IN 47303",
    websiteUrl: "https://www.greekspizzeria.com/",
    rating: 4.4,
    distanceFromCampus: "0.3 miles"
  },
  {
    id: "the-chug-muncie",
    schoolId: "ballstate",
    name: "The Chug",
    cuisine: "American Pub",
    description: "This iconic Ball State bar and grill is known for its burgers and lively atmosphere. The Double Chug burger is a local legend, featuring two patties with all the fixings.",
    address: "409 N Martin St, Muncie, IN 47303",
    rating: 4.3,
    distanceFromCampus: "0.2 miles"
  },
  
  // Bowling Green
  {
    id: "sams-bg",
    schoolId: "bowlinggreen",
    name: "Sam B's Restaurant",
    cuisine: "American",
    description: "A Bowling Green tradition since 1972, Sam B's offers a diverse menu from steaks to pasta in a casual setting. Their outdoor patio is perfect for nice weather.",
    address: "163 S Main St, Bowling Green, OH 43402",
    websiteUrl: "https://www.sambs.com/",
    rating: 4.5,
    distanceFromCampus: "0.6 miles"
  },
  {
    id: "myles-pizza-bg",
    schoolId: "bowlinggreen",
    name: "Myles' Pizza Pub",
    cuisine: "Pizza",
    description: "Though the original closed in 2017, Myles' has reopened and continues its legacy as BG's most beloved pizza spot. Their thick-crust pizzas loaded with toppings are worth the wait.",
    address: "140 E Wooster St, Bowling Green, OH 43402",
    rating: 4.8,
    distanceFromCampus: "0.4 miles"
  },
  
  // Buffalo
  {
    id: "duffs-buffalo",
    schoolId: "buffalo",
    name: "Duff's Famous Wings",
    cuisine: "Wings",
    description: "No trip to Buffalo is complete without authentic Buffalo wings, and Duff's is among the best. Their sauce ranges from mild to 'Death Sauce' for the brave.",
    address: "3651 Sheridan Dr, Amherst, NY 14226",
    websiteUrl: "https://www.duffswings.com/",
    rating: 4.6,
    distanceFromCampus: "1.2 miles"
  },
  {
    id: "lake-effect-buffalo",
    schoolId: "buffalo",
    name: "Lake Effect Diner",
    cuisine: "Diner",
    description: "Housed in a classic 1950s diner car, Lake Effect serves up homemade comfort food. Their breakfast is served all day, making it perfect for students recovering from late nights.",
    address: "3165 Main St, Buffalo, NY 14214",
    rating: 4.5,
    distanceFromCampus: "0.3 miles"
  },
  
  // Toledo
  {
    id: "tony-packos-toledo",
    schoolId: "toledo",
    name: "Tony Packo's",
    cuisine: "Hungarian-American",
    description: "Made famous by M*A*S*H, Tony Packo's serves their legendary Hungarian hot dogs and other specialties. Don't miss the chance to see the collection of celebrity-signed hot dog buns.",
    address: "1902 Front St, Toledo, OH 43605",
    websiteUrl: "https://www.tonypacko.com/",
    rating: 4.4,
    distanceFromCampus: "3.5 miles"
  },
  {
    id: "kengo-toledo",
    schoolId: "toledo",
    name: "Kengo Sushi & Yakitori",
    cuisine: "Japanese",
    description: "This upscale yet approachable spot offers authentic Japanese cuisine. The chef's choice sashimi platter is perfect for special occasions.",
    address: "38 S Saint Clair St, Toledo, OH 43604",
    rating: 4.8,
    distanceFromCampus: "2.8 miles"
  }
  
  // More restaurants would be added for the remaining MAC schools
];