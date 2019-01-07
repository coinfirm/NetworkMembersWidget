<?php

// Your API token
$token = 'TOKEN_STRING';

function reportAddress($token, $request) {
    $headers = [
        "Authorization: Bearer $token",
        "Content-Type: application/json"
    ];
    $payload = [
        "address" => $request['value']['address'],
        "address_type" => $request['value']['addressType'],
        "rate" => $request['value']['rate'],
        "owner" => '',
        "description" => '',
        "urls" => [
            [ "url" => "http://coinfirm.io" ]
        ],
        "files" => [
            [
                "base64" => $request['value']['file'],
                "type" => $request['value']['fileType']
            ]
        ]
    ];

    foreach ($request['value']['flags'] as $flag => $enabled) {
        $payload['flags'][$flag] = $enabled;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,"https://api.coinfirm.io/v3/panels/nm/reported_address");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close ($ch);

    if ($httpcode === 201) {
        return ['success' => true];
    }

    try {
        return json_decode($response, true);
    } catch (Exception $exception) {
        return ['message' => 'API error'];
    }
}

$json = file_get_contents('php://input');
$request = json_decode($json, true);
$response = reportAddress($token, $request);

header('Content-Type: application/json');
echo json_encode($response);
