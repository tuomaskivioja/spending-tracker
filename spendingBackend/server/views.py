from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from .models import Transaction
import csv
# Create your views here.

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def upload_csv(request):
    if request.method == 'POST':
        csv_file = request.FILES['csv_file']
        decoded_file = csv_file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        for row in reader:
            Transaction.objects.create(amount=row['amount'], date=row['date'], description=row['description'])
        return JsonResponse({'message': 'CSV file uploaded successfully'})
    return HttpResponse(status=400)


def get_monthly_spending(request):
    # Aggregate transactions by month and sum their amounts
    monthly_spending = (
        Transaction.objects
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total_amount=Sum('amount'))
        .order_by('month')
    )

    # Format the data as a list of dictionaries
    formatted_data = [
        {"month": entry['month'].strftime('%B'), "amount": entry['total_amount']}
        for entry in monthly_spending
    ]

    return JsonResponse(formatted_data, safe=False)