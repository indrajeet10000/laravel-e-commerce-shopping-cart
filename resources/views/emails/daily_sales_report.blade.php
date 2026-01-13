<!DOCTYPE html>
<html>

<head>
    <title>Daily Sales Report</title>
</head>

<body>
    <h1>Daily Sales Report</h1>
    <table border="1" cellspacing="0" cellpadding="5">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($reportData as $item)
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td>{{ $item['quantity'] }}</td>
                    <td>${{ number_format($item['revenue'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>