
async function create_dynamodb()
{
 
  await fetch('config.json')
  .then(response => response.json())
  .then(config => {
    AWS.config.update({
      region: config.region,
      credentials: new AWS.Credentials(config.accessKeyId, config.secretAccessKey)
    });
    console.log("AWS SDK configured with fetched credentials");
  })
  .catch(error => {
    console.error("Error fetching config.json:", error);
  });

    var dynamodb = new AWS.DynamoDB.DocumentClient();
    return dynamodb;
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    var params = {
        TableName: 'logins',
        Key: {
          'email': email
        }
      };

    const dynamodb = await create_dynamodb();

    console.log("AWS and DynamoDB configured.");
    
      dynamodb.get(params, function(err, data) {
        if (err) {
          console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
          if (data.Item) {
            // Compare the hashed password
            if(data.Item.password == password)
            {
                console.log("Login successful!");
                window.location.href = "home.html";
            }
            else
            {
              console.log("Invalid Credentials!");
              document.getElementById('sign-in').innerHTML = "Invalid credentials! Please try again.";
            }
          } else {
            console.log('User not found!');
            document.getElementById('sign-in').innerHTML = "User not found!";
          }
        }
      });
}


async function handleSignup(event)
{
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    // var rememberMe = form.rememberMe.checked;

    var params = {
        TableName: 'logins',
        Item: {
          'email': email,
          'password': password,
        }
      };
    
    const dynamodb = await create_dynamodb();

    dynamodb.put(params, function(err, data) {
        if (err) {
            console.log(`email = ${email}, password = ${password}`);
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            window.location.href = "index.html";
        }
    });

}
