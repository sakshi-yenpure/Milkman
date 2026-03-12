from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ChatbotView(APIView):
    def post(self, request):
        query = request.data.get('query', '').lower()
        if not query:
            return Response({"response": "I didn't quite catch that. Could you please rephrase?"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = "I'm sorry, I don't have information about that. For more help, please contact our support at support@milkman.com."
        
        if "hello" in query or "hi" in query:
            response = "Hello! Welcome to Milkman. How can I assist you today?"
        elif "milk" in query:
            response = "We offer a variety of milk, including Whole Milk, Toned Milk, Skim Milk, and Almond Milk. You can find them in our Products section."
        elif "curd" in query or "yogurt" in query:
            response = "We have fresh Curd and Greek Yogurt available. Check out the Curd section in Products."
        elif "price" in query or "cost" in query:
            response = "Our prices vary by product. Please visit our Products page to see the latest pricing."
        elif "subscribe" in query or "subscription" in query:
            response = "You can subscribe to our daily dairy deliveries by going to the 'Subscribe' section on our website."
        elif "delivery" in query:
            response = "We deliver fresh dairy products every morning. You can set your delivery preferences in your profile."
        elif "account" in query or "profile" in query:
            response = "You can manage your account and delivery details in the 'My Profile' section."
        elif "thank" in query:
            response = "You're very welcome! Is there anything else I can help you with?"
            
        return Response({"response": response}, status=status.HTTP_200_OK)
