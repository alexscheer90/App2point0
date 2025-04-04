import { Game, NewsItem } from "@shared/schema";

/**
 * Check if the browser supports notifications
 */
export const isNotificationSupported = (): boolean => {
  return "Notification" in window;
};

/**
 * Request permission to show notifications
 * @returns A promise that resolves to true if permission was granted, false otherwise
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  // If permission is already granted, return true
  if (Notification.permission === "granted") {
    return true;
  }

  // If permission was denied before, return false
  if (Notification.permission === "denied") {
    return false;
  }

  // Request permission
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

/**
 * Send a notification for a game score update
 */
export const sendGameScoreNotification = (
  game: Game,
  homeTeam: any,
  awayTeam: any
): void => {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return;
  }

  const homeScore = game.homeTeamScore ?? 0;
  const awayScore = game.awayTeamScore ?? 0;
  
  const title = `${homeTeam.shortName} ${homeScore} - ${awayScore} ${awayTeam.shortName}`;
  
  let message = "";
  if (game.status === "final") {
    message = `Final: ${homeTeam.shortName} ${homeScore} - ${awayScore} ${awayTeam.shortName}`;
  } else {
    const periodText = game.period ? `Period ${game.period}` : "";
    const clockText = game.clock || "0:00";
    message = `${periodText} ${clockText}: ${homeTeam.shortName} ${homeScore} - ${awayScore} ${awayTeam.shortName}`;
  }

  try {
    const notification = new Notification(title, {
      body: message,
      icon: homeTeam.logoUrl, // Use home team logo as icon
      tag: `game_${game.id}`, // Use tag to prevent duplicate notifications
    });

    // Close the notification after 10 seconds
    setTimeout(() => notification.close(), 10000);
  } catch (error) {
    console.error("Error sending game score notification:", error);
  }
};

/**
 * Send a notification for a news item
 */
export const sendNewsNotification = (newsItem: NewsItem): void => {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return;
  }

  const title = newsItem.title;
  const message = newsItem.summary;

  try {
    const notification = new Notification(title, {
      body: message,
      tag: `news_${newsItem.id}`, // Use tag to prevent duplicate notifications
    });

    // Close the notification after 10 seconds
    setTimeout(() => notification.close(), 10000);

    // Click handler
    notification.onclick = () => {
      window.open(newsItem.url, "_blank");
    };
  } catch (error) {
    console.error("Error sending news notification:", error);
  }
};