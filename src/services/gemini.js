import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateBio = async (userAnswers) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = createPrompt(userAnswers);
    
    // Generate long bio
    const longBioResult = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
    });
    const longBio = longBioResult.response.text();

    // Generate short bio
    const shortBioPrompt = `Create a very concise, impactful one-sentence professional bio (maximum 25 words) that captures the essence of this person: ${longBio}`;
    const shortBioResult = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: shortBioPrompt }]
      }],
    });
    const shortBio = shortBioResult.response.text();

    return { longBio, shortBio };
  } catch (error) {
    console.error('Error generating bio:', error);
    throw error;
  }
};

const createPrompt = (userAnswers) => {
  return `Create a concise, engaging professional biography (maximum 100 words) for:
    Name: ${userAnswers.name || 'Anonymous'}
    Role: ${userAnswers.role || 'Professional'}
    Industry: ${userAnswers.industry || 'Various industries'}
    Experience: ${userAnswers.experience || 'Experienced professional'}
    Skills: ${userAnswers.skills || 'Various professional skills'}
    Achievements: ${userAnswers.achievements || 'Notable achievements in their field'}
    
    Make it brief but impactful, focusing on their most significant achievements and unique value proposition.
    Write in third person, maintain a professional tone, and keep it memorable.`;
};
