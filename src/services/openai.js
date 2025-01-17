import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateBio = async (userAnswers) => {
  try {
    const prompt = createPrompt(userAnswers);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional bio writer who creates engaging and personalized professional biographies."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const longBio = completion.choices[0].message.content;

    // Generate short bio
    const shortBioCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Create a concise one-sentence professional bio based on the following long bio."
        },
        {
          role: "user",
          content: `Create a short, one-sentence version of this bio: ${longBio}`
        }
      ],
      temperature: 0.7,
    });

    const shortBio = shortBioCompletion.choices[0].message.content;

    return { longBio, shortBio };
  } catch (error) {
    console.error('Error generating bio:', error);
    throw error;
  }
};

const createPrompt = (userAnswers) => {
  return `Create a professional biography for someone with the following details:
    Name: ${userAnswers.name || 'Anonymous'}
    Role: ${userAnswers.role || 'Professional'}
    Industry: ${userAnswers.industry || 'Various industries'}
    Experience: ${userAnswers.experience || 'Experienced professional'}
    Skills: ${userAnswers.skills || 'Various professional skills'}
    Achievements: ${userAnswers.achievements || 'Notable achievements in their field'}
    
    Please create an engaging, professional bio that highlights their experience, skills, and achievements. 
    The bio should be written in third person and maintain a professional tone while being engaging and memorable.`;
};
