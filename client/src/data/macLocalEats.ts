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
    distanceFromCampus: "0.8 miles",
    priceRange: "$$"
  },
  {
    id: "diamond-deli-akron",
    schoolId: "akron",
    name: "Diamond Deli",
    cuisine: "Deli/Sandwiches",
    description: "Known for its oversized sandwiches named after Akron landmarks, Diamond Deli offers fresh ingredients and friendly service. Their homemade soups and sides complement their signature sandwiches perfectly.",
    address: "378 S Main St, Akron, OH 44311",
    rating: 4.6,
    distanceFromCampus: "0.5 miles",
    priceRange: "$"
  },
  {
    id: "nervous-dog-akron",
    schoolId: "akron",
    name: "Nervous Dog Coffee Bar",
    cuisine: "Coffee/Cafe",
    description: "Popular study spot for Akron students with great coffee, sandwiches, and baked goods. The relaxed atmosphere makes it ideal for hitting the books or casual meetups.",
    address: "1530 W Market St, Akron, OH 44313",
    websiteUrl: "https://nervousdog.com/",
    rating: 4.5,
    distanceFromCampus: "1.2 miles",
    priceRange: "$"
  },
  {
    id: "lockview-akron",
    schoolId: "akron",
    name: "The Lockview",
    cuisine: "American",
    description: "Known for their gourmet grilled cheese sandwiches and extensive craft beer selection. The rooftop patio offers great views of downtown Akron.",
    address: "207 S Main St, Akron, OH 44308",
    websiteUrl: "http://www.thelockview.com/",
    rating: 4.4,
    distanceFromCampus: "0.6 miles",
    priceRange: "$$"
  },
  {
    id: "swensons-akron",
    schoolId: "akron",
    name: "Swensons Drive-In",
    cuisine: "American/Burgers",
    description: "An Akron institution since 1934, Swensons is famous for their Galley Boy burger and milkshakes. The classic drive-in service adds to the nostalgic experience.",
    address: "40 S Hawkins Ave, Akron, OH 44313",
    websiteUrl: "https://swensonsdriveins.com/",
    rating: 4.8,
    distanceFromCampus: "2.3 miles",
    priceRange: "$"
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
    distanceFromCampus: "0.3 miles",
    priceRange: "$$"
  },
  {
    id: "the-chug-muncie",
    schoolId: "ballstate",
    name: "The Chug",
    cuisine: "American Pub",
    description: "This iconic Ball State bar and grill is known for its burgers and lively atmosphere. The Double Chug burger is a local legend, featuring two patties with all the fixings.",
    address: "409 N Martin St, Muncie, IN 47303",
    rating: 4.3,
    distanceFromCampus: "0.2 miles",
    priceRange: "$"
  },
  {
    id: "queer-hummus-muncie",
    schoolId: "ballstate",
    name: "Queer Chocolate Cafe",
    cuisine: "Cafe/Mediterranean",
    description: "Welcoming cafe known for its homemade hummus, Mediterranean dishes, and excellent coffee. The inclusive atmosphere and cozy interior make it a favorite gathering spot for students.",
    address: "1624 W University Ave, Muncie, IN 47303",
    rating: 4.7,
    distanceFromCampus: "0.3 miles",
    priceRange: "$$"
  },
  {
    id: "tuhus-muncie",
    schoolId: "ballstate",
    name: "Tuhus Thai",
    cuisine: "Thai",
    description: "Authentic Thai cuisine with vegetarian and vegan options. The perfect spot for students looking to explore international flavors without breaking the bank.",
    address: "1606 W University Ave, Muncie, IN 47303",
    rating: 4.5,
    distanceFromCampus: "0.3 miles",
    priceRange: "$$"
  },
  {
    id: "scotty-muncie",
    schoolId: "ballstate",
    name: "Scotty's Brewhouse",
    cuisine: "American/Brewery",
    description: "Founded by a Ball State alumnus, Scotty's is a Muncie institution known for its extensive beer selection and creative burgers. The game day atmosphere is electric.",
    address: "1700 W University Ave, Muncie, IN 47303",
    websiteUrl: "https://www.scottysbrewhouse.com/",
    rating: 4.2,
    distanceFromCampus: "0.4 miles",
    priceRange: "$$"
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
    distanceFromCampus: "0.6 miles",
    priceRange: "$$"
  },
  {
    id: "myles-pizza-bg",
    schoolId: "bowlinggreen",
    name: "Myles' Pizza Pub",
    cuisine: "Pizza",
    description: "Though the original closed in 2017, Myles' has reopened and continues its legacy as BG's most beloved pizza spot. Their thick-crust pizzas loaded with toppings are worth the wait.",
    address: "140 E Wooster St, Bowling Green, OH 43402",
    rating: 4.8,
    distanceFromCampus: "0.4 miles",
    priceRange: "$$"
  },
  {
    id: "grounds-for-thought-bg",
    schoolId: "bowlinggreen",
    name: "Grounds For Thought",
    cuisine: "Coffee/Cafe",
    description: "Popular study spot combining a coffee shop, bookstore, and local art gallery. Their house-roasted coffee and homemade pastries make this a BGSU student favorite.",
    address: "174 S Main St, Bowling Green, OH 43402",
    websiteUrl: "https://www.groundsforthought.com/",
    rating: 4.7,
    distanceFromCampus: "0.6 miles",
    priceRange: "$"
  },
  {
    id: "rapid-fired-pizza-bg",
    schoolId: "bowlinggreen",
    name: "Rapid Fired Pizza",
    cuisine: "Pizza",
    description: "Build-your-own personal pizzas cooked in just 180 seconds. Perfect for students on a tight schedule who still want quality food at affordable prices.",
    address: "852 S Main St, Bowling Green, OH 43402",
    websiteUrl: "https://rapidfiredpizza.com/",
    rating: 4.4,
    distanceFromCampus: "1.2 miles",
    priceRange: "$"
  },
  {
    id: "kabob-it-bg",
    schoolId: "bowlinggreen",
    name: "Kabob It",
    cuisine: "Middle Eastern",
    description: "Authentic Middle Eastern cuisine with generous portions. Their shawarma, falafel, and signature garlic sauce have a loyal following among BGSU students.",
    address: "1616 E Wooster St, Bowling Green, OH 43402",
    rating: 4.6,
    distanceFromCampus: "0.5 miles",
    priceRange: "$$"
  },
  
  // Central Michigan
  {
    id: "mountain-town-cmu",
    schoolId: "centralmichigan",
    name: "Mountain Town Station",
    cuisine: "American/Brewery",
    description: "Housed in a historic train depot, Mountain Town offers house-brewed beers and a diverse menu. Their prime rib and salmon are local favorites.",
    address: "506 W Broadway St, Mt Pleasant, MI 48858",
    websiteUrl: "https://www.mountaintown.com/",
    rating: 4.5,
    distanceFromCampus: "0.8 miles",
    priceRange: "$$$"
  },
  {
    id: "dogs-shake-cmu",
    schoolId: "centralmichigan",
    name: "Dog's & Shake",
    cuisine: "American",
    description: "Casual spot serving up gourmet hot dogs, burgers, and milkshakes. Their creative toppings and affordable prices make it a CMU student staple.",
    address: "1218 S Mission St, Mt Pleasant, MI 48858",
    rating: 4.4,
    distanceFromCampus: "0.5 miles",
    priceRange: "$"
  },
  {
    id: "pisanello-cmu",
    schoolId: "centralmichigan",
    name: "Pisanello's Pizza",
    cuisine: "Pizza",
    description: "A Mt. Pleasant institution serving delicious pizza with a wide variety of toppings. Their special crust recipe and generous portions keep CMU students coming back.",
    address: "110 W Pickard St, Mt Pleasant, MI 48858",
    websiteUrl: "https://www.pisanellospizza.com/",
    rating: 4.6,
    distanceFromCampus: "1.0 miles",
    priceRange: "$$"
  },
  {
    id: "max-and-emilys-cmu",
    schoolId: "centralmichigan",
    name: "Max & Emily's",
    cuisine: "Sandwiches/Cafe",
    description: "Popular cafe known for their gourmet sandwiches, soups, and salads. They often host live music in the summer, making it a community hub.",
    address: "125 E Broadway St, Mt Pleasant, MI 48858",
    websiteUrl: "https://www.maxandemilys.com/",
    rating: 4.7,
    distanceFromCampus: "0.7 miles",
    priceRange: "$$"
  },
  {
    id: "greentree-cmu",
    schoolId: "centralmichigan",
    name: "Greentree Co-op",
    cuisine: "Health Food/Cafe",
    description: "Community-owned grocery and cafe serving fresh, organic meals. Their vegetarian and vegan options are especially popular with health-conscious students.",
    address: "214 N Franklin St, Mt Pleasant, MI 48858",
    websiteUrl: "https://www.greentree.coop/",
    rating: 4.5,
    distanceFromCampus: "0.9 miles",
    priceRange: "$$"
  },
  
  // Eastern Michigan
  {
    id: "sidetrack-emu",
    schoolId: "easternmichigan",
    name: "Sidetrack Bar & Grill",
    cuisine: "American Pub",
    description: "Historic bar known for award-winning burgers and extensive beer selection. The railroad-themed interior and patio seating make it a unique Ypsilanti experience.",
    address: "56 E Cross St, Ypsilanti, MI 48198",
    websiteUrl: "https://www.sidetrackbarandgrill.com/",
    rating: 4.6,
    distanceFromCampus: "1.5 miles",
    priceRange: "$$"
  },
  {
    id: "aubrees-emu",
    schoolId: "easternmichigan",
    name: "Aubree's Pizzeria & Grill",
    cuisine: "Pizza/American",
    description: "Local chain serving Detroit-style deep dish pizza and pub fare. Their EMU student specials make it a popular spot for campus gatherings.",
    address: "39 E Cross St, Ypsilanti, MI 48198",
    websiteUrl: "https://www.aubrees.com/",
    rating: 4.4,
    distanceFromCampus: "1.5 miles",
    priceRange: "$$"
  },
  {
    id: "maejes-emu",
    schoolId: "easternmichigan",
    name: "Maiz Mexican Cantina",
    cuisine: "Mexican",
    description: "Authentic Mexican cuisine with a modern twist. Their fresh guacamole prepared tableside and creative margaritas are highlights.",
    address: "36 E Cross St, Ypsilanti, MI 48198",
    websiteUrl: "https://www.eatatmaiz.com/",
    rating: 4.5,
    distanceFromCampus: "1.5 miles",
    priceRange: "$$"
  },
  {
    id: "beezy-emu",
    schoolId: "easternmichigan",
    name: "Beezy's Cafe",
    cuisine: "Cafe/Sandwiches",
    description: "Simple, fresh cafe food served in a cozy environment. Their breakfast sandwiches and homemade soups are perfect for studying or casual meetings.",
    address: "20 N Washington St, Ypsilanti, MI 48197",
    rating: 4.7,
    distanceFromCampus: "1.0 miles",
    priceRange: "$"
  },
  {
    id: "tower-inn-emu",
    schoolId: "easternmichigan",
    name: "Tower Inn Cafe",
    cuisine: "Pizza/Greek",
    description: "Campus favorite offering pizza, Greek specialties, and American classics. Their proximity to EMU makes it perfect for a quick bite between classes.",
    address: "701 W Cross St, Ypsilanti, MI 48197",
    websiteUrl: "https://www.towerinncafe.com/",
    rating: 4.3,
    distanceFromCampus: "0.3 miles",
    priceRange: "$$"
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
    distanceFromCampus: "1.2 miles",
    priceRange: "$$"
  },
  {
    id: "lake-effect-buffalo",
    schoolId: "buffalo",
    name: "Lake Effect Diner",
    cuisine: "Diner",
    description: "Housed in a classic 1950s diner car, Lake Effect serves up homemade comfort food. Their breakfast is served all day, making it perfect for students recovering from late nights.",
    address: "3165 Main St, Buffalo, NY 14214",
    rating: 4.5,
    distanceFromCampus: "0.3 miles",
    priceRange: "$"
  },
  {
    id: "anchor-bar-buffalo",
    schoolId: "buffalo",
    name: "Anchor Bar",
    cuisine: "Wings",
    description: "The birthplace of the original Buffalo wing in 1964. A must-visit for any wing enthusiast and UB student seeking to experience Buffalo's culinary claim to fame.",
    address: "1047 Main St, Buffalo, NY 14209",
    websiteUrl: "https://www.anchorbar.com/",
    rating: 4.3,
    distanceFromCampus: "2.5 miles",
    priceRange: "$$"
  },
  {
    id: "teds-buffalo",
    schoolId: "buffalo",
    name: "Ted's Hot Dogs",
    cuisine: "American",
    description: "A Buffalo institution since 1927, Ted's charcoal-broiled hot dogs are legendary. Their homemade relish and loganberry drinks are regional specialties.",
    address: "2312 Sheridan Dr, Tonawanda, NY 14150",
    websiteUrl: "https://www.tedshotdogs.com/",
    rating: 4.7,
    distanceFromCampus: "3.1 miles",
    priceRange: "$"
  },
  {
    id: "amy-place-buffalo",
    schoolId: "buffalo",
    name: "Amy's Place",
    cuisine: "Lebanese/Vegan",
    description: "Beloved by UB students for its affordable Lebanese-American cuisine with plenty of vegetarian and vegan options. The lentil berry sandwich is a local favorite.",
    address: "3234 Main St, Buffalo, NY 14214",
    rating: 4.5,
    distanceFromCampus: "0.2 miles",
    priceRange: "$"
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
    distanceFromCampus: "3.5 miles",
    priceRange: "$$"
  },
  {
    id: "kengo-toledo",
    schoolId: "toledo",
    name: "Kengo Sushi & Yakitori",
    cuisine: "Japanese",
    description: "This upscale yet approachable spot offers authentic Japanese cuisine. The chef's choice sashimi platter is perfect for special occasions.",
    address: "38 S Saint Clair St, Toledo, OH 43604",
    rating: 4.8,
    distanceFromCampus: "2.8 miles",
    priceRange: "$$$"
  },
  {
    id: "balance-toledo",
    schoolId: "toledo",
    name: "Balance Pan-Asian Grille",
    cuisine: "Asian Fusion",
    description: "Modern, healthy Asian bowls with fresh ingredients. Rocket students love their affordable, customizable options and the trendy, energetic atmosphere.",
    address: "5860 N Main St, Sylvania, OH 43560",
    websiteUrl: "https://www.balancegrille.com/",
    rating: 4.6,
    distanceFromCampus: "1.7 miles",
    priceRange: "$$"
  },
  {
    id: "registry-bistro-toledo",
    schoolId: "toledo",
    name: "Registry Bistro",
    cuisine: "New American",
    description: "Upscale farm-to-table dining in downtown Toledo. Perfect for special occasions or when parents are visiting. Their seasonal menu showcases local ingredients.",
    address: "144 N Superior St, Toledo, OH 43604",
    websiteUrl: "https://www.registrybistro.com/",
    rating: 4.7,
    distanceFromCampus: "2.5 miles",
    priceRange: "$$$"
  },
  {
    id: "shorty-toledo",
    schoolId: "toledo",
    name: "Shorty's True American Roadhouse",
    cuisine: "BBQ",
    description: "Toledo's premier BBQ spot with slow-smoked meats and classic sides. Their pulled pork and mac & cheese are local favorites for Rocket tailgating.",
    address: "5111 Monroe St, Toledo, OH 43623",
    websiteUrl: "https://www.shortysbbq.com/",
    rating: 4.4,
    distanceFromCampus: "2.0 miles",
    priceRange: "$$"
  },
  
  // Massachusetts
  {
    id: "antonios-pizza-massachusetts",
    schoolId: "massachusetts",
    name: "Antonio's Pizza",
    cuisine: "Pizza",
    description: "Famous for their creative pizza slices, Antonio's is a Massachusetts institution. Their unique toppings and combinations make this a must-visit spot for students and visitors alike.",
    address: "31 N Pleasant St, Amherst, MA 01002",
    websiteUrl: "https://www.antoniospizza.com/",
    rating: 4.7,
    distanceFromCampus: "1.2 miles",
    priceRange: "$"
  },
  {
    id: "amherst-brewing-massachusetts",
    schoolId: "massachusetts",
    name: "Amherst Brewing",
    cuisine: "American/Brewery",
    description: "Craft beer and elevated pub food make this a popular gathering spot. Their outdoor beer garden is perfect for nice weather, and they often host live music and events.",
    address: "10 University Dr, Amherst, MA 01002",
    websiteUrl: "https://www.amherstbrewing.com/",
    rating: 4.5,
    distanceFromCampus: "1.5 miles",
    priceRange: "$$"
  },
  {
    id: "mission-cantina-massachusetts",
    schoolId: "massachusetts",
    name: "Mission Cantina",
    cuisine: "Mexican",
    description: "Authentic Mexican cuisine with creative cocktails. Their tacos and burritos are made with fresh ingredients, and the festive atmosphere makes it a favorite among students.",
    address: "485 West St, Amherst, MA 01002",
    websiteUrl: "https://www.missioncantinaamherst.com/",
    rating: 4.6,
    distanceFromCampus: "2.3 miles",
    priceRange: "$$"
  },
  {
    id: "black-sheep-massachusetts",
    schoolId: "massachusetts",
    name: "The Black Sheep",
    cuisine: "Deli/Bakery",
    description: "Beloved local deli and bakery serving breakfast and lunch. Their signature sandwiches, homemade bread, and pastries are must-tries for Massachusetts students.",
    address: "79 Main St, Amherst, MA 01002",
    websiteUrl: "https://www.blacksheepdeli.com/",
    rating: 4.5,
    distanceFromCampus: "1.0 miles",
    priceRange: "$$"
  },
  {
    id: "judie-massachusetts",
    schoolId: "massachusetts",
    name: "Judie's Restaurant",
    cuisine: "American",
    description: "An Amherst institution known for their signature popovers and creative American cuisine. A favorite for Parents Weekend and graduation celebrations.",
    address: "51 N Pleasant St, Amherst, MA 01002",
    rating: 4.4,
    distanceFromCampus: "1.1 miles",
    priceRange: "$$$"
  },
  
  // Kent State
  {
    id: "mikes-place-kent",
    schoolId: "kentstate",
    name: "Mike's Place",
    cuisine: "American/Eclectic",
    description: "Quirky Kent landmark with eclectic decor and a massive menu. The unique atmosphere and generous portions make it a favorite among KSU students.",
    address: "1700 S Water St, Kent, OH 44240",
    websiteUrl: "https://www.mikesplacerestaurant.com/",
    rating: 4.3,
    distanceFromCampus: "0.5 miles",
    priceRange: "$$"
  },
  {
    id: "rays-place-kent",
    schoolId: "kentstate",
    name: "Ray's Place",
    cuisine: "American Pub",
    description: "Historic pub serving burgers, sandwiches, and local brews since 1937. Their famous 'MoFo' burger is a Kent State tradition.",
    address: "135 Franklin Ave, Kent, OH 44240",
    websiteUrl: "https://www.raysplacekent.com/",
    rating: 4.5,
    distanceFromCampus: "0.7 miles",
    priceRange: "$$"
  },
  {
    id: "wild-goats-kent",
    schoolId: "kentstate",
    name: "Wild Goats Café",
    cuisine: "Breakfast/Lunch",
    description: "Beloved breakfast and lunch spot with creative omelets and sandwiches. Their homemade corned beef hash is worth the weekend wait.",
    address: "319 W Main St, Kent, OH 44240",
    rating: 4.7,
    distanceFromCampus: "1.0 miles",
    priceRange: "$$"
  },
  {
    id: "taco-tontos-kent",
    schoolId: "kentstate",
    name: "Taco Tontos",
    cuisine: "Mexican",
    description: "Local Mexican joint known for massive burritos and creative tacos. Their salsa bar features unique homemade options that keep students coming back.",
    address: "123 Franklin Ave, Kent, OH 44240",
    rating: 4.6,
    distanceFromCampus: "0.7 miles",
    priceRange: "$"
  },
  {
    id: "twisted-meltz-kent",
    schoolId: "kentstate",
    name: "Twisted Meltz",
    cuisine: "Sandwiches",
    description: "Gourmet grilled cheese sandwiches with creative combinations. Founded by KSU alumni, the restaurant features Kent State themed sandwiches.",
    address: "164 E Main St, Kent, OH 44240",
    websiteUrl: "https://www.twistedmeltz.com/",
    rating: 4.5,
    distanceFromCampus: "0.8 miles",
    priceRange: "$$"
  },
  
  // Miami (Ohio)
  {
    id: "skipper-miami",
    schoolId: "miamioh",
    name: "Skipper's Pub & Top Deck",
    cuisine: "American Pub",
    description: "Longtime Miami University hangout featuring pub food and a lively atmosphere. The outdoor deck is perfect for nice weather gatherings.",
    address: "121 S Walnut St, Oxford, OH 45056",
    rating: 4.4,
    distanceFromCampus: "0.3 miles",
    priceRange: "$$"
  },
  {
    id: "bagel-miami",
    schoolId: "miamioh",
    name: "Bagel & Deli Shop",
    cuisine: "Sandwiches",
    description: "Oxford institution serving steamed bagel sandwiches with creative names. Open late for students with midnight cravings.",
    address: "119 E High St, Oxford, OH 45056",
    websiteUrl: "https://www.bagelanddeli.com/",
    rating: 4.7,
    distanceFromCampus: "0.2 miles",
    priceRange: "$"
  },
  {
    id: "mac-joes-miami",
    schoolId: "miamioh",
    name: "Mac & Joe's",
    cuisine: "American Pub",
    description: "Historic Oxford bar and grill serving pub favorites since 1946. A go-to spot for returning alumni and current students alike.",
    address: "21 E High St, Oxford, OH 45056",
    rating: 4.3,
    distanceFromCampus: "0.2 miles",
    priceRange: "$$"
  },
  {
    id: "kofenya-miami",
    schoolId: "miamioh",
    name: "Kofenya Coffee House",
    cuisine: "Coffee/Cafe",
    description: "Cozy coffee shop popular with students for studying. Their specialty drinks and homemade pastries provide the perfect fuel for all-nighters.",
    address: "38 W High St, Oxford, OH 45056",
    websiteUrl: "https://www.kofenyacoffee.com/",
    rating: 4.6,
    distanceFromCampus: "0.3 miles",
    priceRange: "$"
  },
  {
    id: "fiesta-charra-miami",
    schoolId: "miamioh",
    name: "Fiesta Charra",
    cuisine: "Mexican",
    description: "Authentic Mexican restaurant known for generous portions and strong margaritas. Their festive atmosphere makes it perfect for celebrations.",
    address: "25 W High St, Oxford, OH 45056",
    rating: 4.5,
    distanceFromCampus: "0.2 miles",
    priceRange: "$$"
  },
  
  // Northern Illinois
  {
    id: "villaggio-niu",
    schoolId: "northernillinois",
    name: "Villaggio Ristorante",
    cuisine: "Italian",
    description: "Upscale Italian dining with homemade pasta and classic dishes. Their intimate setting and quality food make it a favorite for special occasions.",
    address: "1215 Blackhawk Rd, DeKalb, IL 60115",
    websiteUrl: "https://www.villaggiodekalb.com/",
    rating: 4.7,
    distanceFromCampus: "1.1 miles",
    priceRange: "$$$"
  },
  {
    id: "fattys-niu",
    schoolId: "northernillinois",
    name: "Fatty's Pub & Grille",
    cuisine: "American Pub",
    description: "Popular sports bar with an extensive menu and large beer selection. Their gameday specials and multiple TVs make it a top spot for NIU sports viewing.",
    address: "1312 W Lincoln Hwy, DeKalb, IL 60115",
    websiteUrl: "https://www.fattypub.com/",
    rating: 4.3,
    distanceFromCampus: "0.5 miles",
    priceRange: "$$"
  },
  {
    id: "fargo-niu",
    schoolId: "northernillinois",
    name: "The Forge of Sycamore",
    cuisine: "American",
    description: "Gastropub featuring craft beer and elevated pub fare. Their unique appetizers and rotating taps make each visit a new experience.",
    address: "1145 W Lincoln Hwy, DeKalb, IL 60115",
    rating: 4.6,
    distanceFromCampus: "0.6 miles",
    priceRange: "$$"
  },
  {
    id: "tapa-la-luna-niu",
    schoolId: "northernillinois",
    name: "Tapa La Luna",
    cuisine: "Spanish/Tapas",
    description: "Intimate tapas restaurant offering small plates and sangria. Perfect for group gatherings where everyone can share and try different dishes.",
    address: "226 E Lincoln Hwy, DeKalb, IL 60115",
    rating: 4.5,
    distanceFromCampus: "0.8 miles",
    priceRange: "$$"
  },
  {
    id: "barbs-little-bit-of-havana-niu",
    schoolId: "northernillinois",
    name: "Barb's Little Bit of Havana",
    cuisine: "Cuban",
    description: "Family-owned Cuban restaurant serving authentic dishes in a cozy setting. Their Cuban sandwiches and empanadas are local favorites.",
    address: "901 Lucinda Ave, DeKalb, IL 60115",
    rating: 4.8,
    distanceFromCampus: "0.1 miles",
    priceRange: "$$"
  },
  
  // Ohio
  {
    id: "casa-nueva-ohio",
    schoolId: "ohio",
    name: "Casa Nueva",
    cuisine: "Mexican/Local",
    description: "Worker-owned cooperative restaurant using local ingredients. Their creative Mexican-inspired dishes and lively atmosphere make it an Athens staple.",
    address: "6 W State St, Athens, OH 45701",
    websiteUrl: "https://www.casanueva.com/",
    rating: 4.6,
    distanceFromCampus: "0.5 miles",
    priceRange: "$$"
  },
  {
    id: "jackies-ohio",
    schoolId: "ohio",
    name: "Jackie O's Pub & Brewery",
    cuisine: "Brewpub",
    description: "Beloved local brewery with excellent pub food. Their craft beers have gained national recognition, and the rooftop patio offers great views of Athens.",
    address: "22 W Union St, Athens, OH 45701",
    websiteUrl: "https://jackieos.com/",
    rating: 4.7,
    distanceFromCampus: "0.4 miles",
    priceRange: "$$"
  },
  {
    id: "bagel-street-ohio",
    schoolId: "ohio",
    name: "Bagel Street Deli",
    cuisine: "Bagels/Sandwiches",
    description: "Popular spot for creative steamed bagel sandwiches. Their signature sandwich menu includes many OU-themed options.",
    address: "27 S Court St, Athens, OH 45701",
    rating: 4.8,
    distanceFromCampus: "0.3 miles",
    priceRange: "$"
  },
  {
    id: "union-street-ohio",
    schoolId: "ohio",
    name: "Union Street Diner",
    cuisine: "Diner",
    description: "24-hour diner serving breakfast all day. A lifesaver for students with late-night study sessions or post-Court Street cravings.",
    address: "70 W Union St, Athens, OH 45701",
    rating: 4.3,
    distanceFromCampus: "0.6 miles",
    priceRange: "$"
  },
  {
    id: "goodfellas-ohio",
    schoolId: "ohio",
    name: "Goodfellas Pizza",
    cuisine: "Pizza",
    description: "Late-night pizza joint famous for their giant slices. Perfect for grabbing a quick bite during a night out on Court Street.",
    address: "34 S Court St, Athens, OH 45701",
    rating: 4.4,
    distanceFromCampus: "0.3 miles",
    priceRange: "$"
  },
  
  // Western Michigan
  {
    id: "bells-wmu",
    schoolId: "westernmichigan",
    name: "Bell's Eccentric Cafe",
    cuisine: "Brewpub",
    description: "Iconic Kalamazoo brewery with a great food menu. Their outdoor beer garden hosts live music, and the brewery tours are a must for beer enthusiasts.",
    address: "355 E Kalamazoo Ave, Kalamazoo, MI 49007",
    websiteUrl: "https://www.bellsbeer.com/",
    rating: 4.8,
    distanceFromCampus: "1.5 miles",
    priceRange: "$$"
  },
  {
    id: "food-dance-wmu",
    schoolId: "westernmichigan",
    name: "Food Dance",
    cuisine: "Farm-to-Table",
    description: "Farm-to-table restaurant committed to local sourcing. Their seasonal menu showcases Michigan's best ingredients in creative, approachable dishes.",
    address: "401 E Michigan Ave, Kalamazoo, MI 49007",
    websiteUrl: "https://www.fooddance.net/",
    rating: 4.7,
    distanceFromCampus: "1.7 miles",
    priceRange: "$$$"
  },
  {
    id: "crows-nest-wmu",
    schoolId: "westernmichigan",
    name: "Crow's Nest",
    cuisine: "Breakfast/Brunch",
    description: "Quirky third-floor cafe serving all-day breakfast. Their creative omelets and friendly service make it worth the wait on busy weekends.",
    address: "816 S Westnedge Ave, Kalamazoo, MI 49008",
    rating: 4.6,
    distanceFromCampus: "1.3 miles",
    priceRange: "$$"
  },
  {
    id: "studio-grill-wmu",
    schoolId: "westernmichigan",
    name: "Studio Grill",
    cuisine: "American",
    description: "Compact downtown spot known for amazing burgers. Their signature Studio Burger with peanut butter is surprisingly delicious.",
    address: "312 W Michigan Ave, Kalamazoo, MI 49007",
    rating: 4.5,
    distanceFromCampus: "1.5 miles",
    priceRange: "$$"
  },
  {
    id: "sweetwaters-wmu",
    schoolId: "westernmichigan",
    name: "Sweetwater's Donut Mill",
    cuisine: "Bakery",
    description: "24-hour donut shop beloved by WMU students. Their creative specialty donuts rotate regularly, and their coffee is the perfect complement.",
    address: "2138 S Westnedge Ave, Kalamazoo, MI 49008",
    websiteUrl: "https://www.sweetwatersdonuts.com/",
    rating: 4.9,
    distanceFromCampus: "2.0 miles",
    priceRange: "$"
  }
];