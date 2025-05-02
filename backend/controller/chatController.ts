import axios from 'axios'

export const chatUser = async (req, res) => {
  const messages = req.body.messages;
  console.log("mess",messages);
  const resultMess = messages.newMessages
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: resultMess,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )
    console.log(response.data)
    const messageContent = response.data.choices[0]?.message?.content;
    console.log("Message Content:", messageContent);
    res.json({ content: messageContent });
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error)
    res.status(500).send('Error fetching data')
  }
}
