# Bootcamp API #

Bootcamp API is a simple restful endpoint to retreive movie data for the fakeflix application

## Running the API locally ##

1. Open your terminal/CLI.
2. Clone the project from git `git clone git@bitbucket.org:slalom-consulting/fakeflix-api.git`
3. Open the directory `cd fakeflix-api`
4. Load Dependencies: `npm install`
5. Start the Server: `npm run start`
6. This will start the API server on `port 9000`.

Works with `Linux` `Mac` or `Windows`

## Tech Stack ##

* [DiskDB](https://www.npmjs.com/package/diskdb)
* [Hapi](http://hapijs.com/)
* [JWT Simple](https://www.npmjs.com/package/jwt-simple)


# *Endpoints*

# Users

## Login
---
Checks to see if there is an account for the given username and password
```
POST '/user/login'
```

#### body
```javascript
{
    "userName":"[THE USER NAME OF THE ACCOUNT]",
    "secret":"[THE PASSWORD FOR THE ACCOUNT]",
}
```

#### Response
The response will be a JSON Web Token encoded string. This should be stored in local/session storage and then injected in the Authorization header with each request to the API
```json
{
    "id": "[SYSTEM ID OF THE USER]",
    "userName": "[USER NAME FOR THE ACCOUNT]",
    "fullName": "[USER'S FULL NAME]",
    "token": "[ENCODED USER OBJECT]"
}
```

## Register
---
Registers an account for the given username and password.
*NOTE*: If an account exists for the given username and password it will
first be deleted before creating a new account
```
POST '/user/register'
```

#### body
```javascript
{
    "fullName": "[FULL NAME OF THE USER]",
    "userName": "[THE USER NAME OF THE ACCOUNT]",
    "secret": "[THE PASSWORD FOR THE ACCOUNT]"
}
```

#### Response
```json
{
    "userName":"[REGISTERED USER USER NAME]",
    "_id":"[REGISTERED USER SYSTEM ID]"
}
```


## Ratings
---
Updates movie ratings
```
POST '/movies/ratings'
```

#### body
```javascript
{
    "id":"[SYSTEM ID OF THE MOVIE]",
    "rating":"[INTEGER VALUE OF THE RATING]"
}
```

#### Response
```json
{
    "title":"[TITLE OF THE MOVIE]",
    "description":"[DESCRIPTION OF THE MOVIE]",
    "year":"[YEAR OF THE MOVIE]",
    "rating":"[RATING AGGREGATION]",
    "ratingCount":"[RATE COUNT]",
    "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
    "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
    "art":"[PATH TO MOVIE ART]",
    "_id":"[SYSTEM ID OF THE MOVIE]"
}
```

## Subscriptions
---
Retrieves a list of movies subscribed to the user

```
GET '/movies/watchlist/{userId}'
```

#### response
```json
[
    {
        "title":"[TITLE OF THE MOVIE]",
        "description":"[DESCRIPTION OF THE MOVIE]",
        "year":"[YEAR OF THE MOVIE]",
        "rating":"[RATING AGGREGATION]",
        "ratingCount":"[RATE COUNT]",
        "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
        "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
        "art":"[PATH TO MOVIE ART]",
        "_id":"[SYSTEM ID OF THE MOVIE]"
    },

    {
        "title":"[TITLE OF THE MOVIE]",
        "description":"[DESCRIPTION OF THE MOVIE]",
        "year":"[YEAR OF THE MOVIE]",
        "rating":"[RATING AGGREGATION]",
        "ratingCount":"[RATE COUNT]",
        "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
        "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
        "art":"[PATH TO MOVIE ART]",
        "_id":"[SYSTEM ID OF THE MOVIE]"
    }
]
```


## Watchlist
---
Adds a user to the movie's subscriber list

```
PUT '/movies/{movieId}/watchlist/{userId}'
```

#### response
```json
{
    "title":"[TITLE OF THE MOVIE]",
    "description":"[DESCRIPTION OF THE MOVIE]",
    "year":"[YEAR OF THE MOVIE]",
    "rating":"[RATING AGGREGATION]",
    "ratingCount":"[RATE COUNT]",
    "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
    "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
    "art":"[PATH TO MOVIE ART]",
    "_id":"[SYSTEM ID OF THE MOVIE]"
}
```

Removes a user from the movie's subscriber list
```
DELETE '/movies/{movieId}/watchlist/{userId}'
```

#### response
```json
{
    "title":"[TITLE OF THE MOVIE]",
    "description":"[DESCRIPTION OF THE MOVIE]",
    "year":"[YEAR OF THE MOVIE]",
    "rating":"[RATING AGGREGATION]",
    "ratingCount":"[RATE COUNT]",
    "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
    "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
    "art":"[PATH TO MOVIE ART]",
    "_id":"[SYSTEM ID OF THE MOVIE]"
}
```
---

# Movies

## All Movies
---
Returns a list of all movies

```
GET '/movies'
```

#### response
```json
[
    {
        "title":"[TITLE OF THE MOVIE]",
        "description":"[DESCRIPTION OF THE MOVIE]",
        "year":"[YEAR OF THE MOVIE]",
        "rating":"[RATING AGGREGATION]",
        "ratingCount":"[RATE COUNT]",
        "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
        "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
        "art":"[PATH TO MOVIE ART]",
        "_id":"[SYSTEM ID OF THE MOVIE]"
    },

    {
        "title":"[TITLE OF THE MOVIE]",
        "description":"[DESCRIPTION OF THE MOVIE]",
        "year":"[YEAR OF THE MOVIE]",
        "rating":"[RATING AGGREGATION]",
        "ratingCount":"[RATE COUNT]",
        "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
        "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
        "art":"[PATH TO MOVIE ART]",
        "_id":"[SYSTEM ID OF THE MOVIE]"
    }
]
```

## Movie
---
Returns a single movie for the given title
```
GET '/movies/{title}'
```

#### response
```json
{
    "title":"[TITLE OF THE MOVIE]",
    "description":"[DESCRIPTION OF THE MOVIE]",
    "year":"[YEAR OF THE MOVIE]",
    "rating":"[RATING AGGREGATION]",
    "ratingCount":"[RATE COUNT]",
    "ratingAverage": "[RATING AVERAGE TO BE USED BY STAR SYSTEM]",
    "subscribers":["[ARRAY OF USER SYSTEM ID's]"],
    "art":"[PATH TO MOVIE ART]",
    "_id":"[SYSTEM ID OF THE MOVIE]"
}
```
