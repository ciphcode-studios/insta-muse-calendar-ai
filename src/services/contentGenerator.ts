
import { ContentPreference } from "@/components/ContentPreferences";
import { PostSuggestion } from "@/components/ContentCalendar";

// This would ideally connect to an AI service API
// For now, we'll use predefined templates and randomly select from them
export const generateContentCalendar = (
  preferences: ContentPreference
): Promise<PostSuggestion[]> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const posts: PostSuggestion[] = [];
      const daysInMonth = 28; // Generate for approximately one month
      
      // Generate sample post times based on frequency
      let postDays: number[] = [];
      
      switch(preferences.postFrequency) {
        case "daily":
          postDays = Array.from({length: daysInMonth}, (_, i) => i);
          break;
        case "3x weekly":
          postDays = Array.from({length: Math.floor(daysInMonth / 2.33)}, (_, i) => i * 2);
          break;
        case "weekly":
          postDays = Array.from({length: Math.floor(daysInMonth / 7)}, (_, i) => i * 7);
          break;
        default:
          postDays = Array.from({length: 10}, (_, i) => i * 3);
      }
      
      // Get current date as the starting point
      const startDate = new Date();
      
      // Create content suggestions based on preferences
      for (let i = 0; i < postDays.length; i++) {
        const postDate = new Date(startDate);
        postDate.setDate(startDate.getDate() + postDays[i]);
        
        const day = postDate.toLocaleDateString("en-US", { weekday: "long" });
        const date = postDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        
        // Generate a random time between 8am and 9pm
        const hour = 8 + Math.floor(Math.random() * 13);
        const minute = Math.floor(Math.random() * 60);
        const time = `${hour}:${minute < 10 ? '0' : ''}${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        // Generate image prompt and caption based on selected content types
        const imagePrompt = generateImagePrompt(preferences, i);
        const caption = generateCaption(preferences, imagePrompt, i);
        
        posts.push({
          day,
          date,
          time,
          imagePrompt,
          caption,
        });
      }
      
      resolve(posts);
    }, 2000);
  });
};

const generateImagePrompt = (preferences: ContentPreference, seed: number): string => {
  // Select content type based on user preferences and seed
  const selectedTypeIndex = seed % preferences.contentTypes.length;
  const contentType = preferences.contentTypes[selectedTypeIndex];
  
  // Base prompts by content type
  const promptTemplates: Record<string, string[]> = {
    lifestyle: [
      "A minimalist workspace with natural light streaming in",
      "Morning coffee ritual with a book and houseplant",
      "Cozy evening setting with soft lighting and blankets",
      "Clean, organized shelves with decorative items"
    ],
    fashion: [
      "Street style outfit with statement accessories against urban backdrop",
      "Layered outfit flatlay on neutral background",
      "Close-up of textured fabric and unique jewelry",
      "Monochromatic outfit with pop of color accessory"
    ],
    food: [
      "Overhead shot of colorful breakfast bowl with fruits",
      "Steaming cup of coffee with pastry on rustic wooden table",
      "Close-up of homemade pasta with fresh herbs",
      "Artfully arranged dinner plate with vibrant vegetables"
    ],
    travel: [
      "Sunset view from mountain peak with silhouetted figure",
      "Narrow alleyway in historic city with unique architecture",
      "Beachside hammock with ocean view",
      "Local market with vibrant colors and textures"
    ],
    fitness: [
      "Morning yoga pose in bright, minimal space",
      "Post-workout healthy meal prep with fresh ingredients",
      "Workout equipment flatlay on light background",
      "Action shot of running shoes on trail with nature backdrop"
    ],
    tech: [
      "Clean workspace with latest gadgets arranged neatly",
      "Close-up of new technology with minimal background",
      "Tech accessories organized aesthetically",
      "Person using device in creative environment"
    ],
    beauty: [
      "Skincare products arranged aesthetically on marble surface",
      "Close-up of eye makeup with complementary colors",
      "Natural beauty products with botanical elements",
      "Morning skincare routine flatlay with fresh flowers"
    ],
    business: [
      "Productive workspace with notebook and coffee",
      "Person working on laptop in modern cafe setting",
      "Close-up of handwritten goals and planning",
      "Business meeting in bright, creative space"
    ]
  };
  
  // Pick a random prompt template from the selected content type
  const templates = promptTemplates[contentType] || promptTemplates.lifestyle;
  const promptIndex = seed % templates.length;
  
  return templates[promptIndex];
};

const generateCaption = (preferences: ContentPreference, imagePrompt: string, seed: number): string => {
  // Caption templates with placeholders
  const captionTemplates = [
    "✨ {description} #lovewhatyoudo #authentic",
    "Today's {type} inspiration. What's your favorite? 💭 #share #connect",
    "Creating moments that matter through {description}. #purpose #passion",
    "Finding joy in {description}. What brings you joy today? ✨",
    "Elevating everyday {type} moments. #lifestyle #growth",
    "Dedicated to {description}. Who else is on this journey? 👇",
    "When {description} becomes part of your daily routine... #habits #growth"
  ];
  
  // Pick a random caption template
  const templateIndex = seed % captionTemplates.length;
  const template = captionTemplates[templateIndex];
  
  // Fill in placeholders
  return template
    .replace("{type}", preferences.contentTypes[0])
    .replace("{description}", preferences.description.split(' ').slice(0, 5).join(' '));
};
