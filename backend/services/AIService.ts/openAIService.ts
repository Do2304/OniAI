export const ChatOpenAIResponse = async (
  client,
  selectedModel,
  messages,
  res,
) => {
  let fullMessage = ''
  let totalToken = 0

  const responseChatGPT = await client.responses.create({
    model: selectedModel,
    input: messages,
    stream: true,
  })

  for await (const event of responseChatGPT) {
    if (event.type === 'response.output_text.delta') {
      const message = event.delta
      if (message) {
        fullMessage += message
        res.write(`data: ${message}\n\n`)
      }
    }
    if (event.type === 'response.completed') {
      const usage = event.response.usage
      totalToken = usage.total_tokens
    }
  }

  return { fullMessage, totalToken }
}
