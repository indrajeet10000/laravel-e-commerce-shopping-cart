<!DOCTYPE html>
<html>

<head>
    <title>Low Stock Alert</title>
</head>

<body>
    <h1>Low Stock Warning</h1>
    <p>The product <strong>{{ $product->name }}</strong> is running low on stock.</p>
    <p>Remaining Quantity: {{ $product->stock_quantity }}</p>
</body>

</html>