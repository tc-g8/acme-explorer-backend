package ass

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._


class TwoScenariosDiagnosis extends Simulation {

	val httpProtocol = http
		.baseUrl("http://localhost:8080/")
		

	val headers_0 = Map(
		"Content-Type" -> "application/json")

	val explorers = csv("explorers.csv")
	val credentials = csv("credentials.csv")

    object AddExplorer {
        val addExplorers = 
			feed(explorers)
			.exec(http("POST ACTOR-EXPLORER")
				.post("api/v2/actors")
				.body(StringBody(session => s"""{ "name": "${session("name").as[String]}", "surname": "${session("surname").as[String]}", "email": "${session("email").as[String]}", "phone": "${session("phone").as[String]}", "address": "${session("address").as[String]}", "password": "${session("password").as[String]}" }"""))
				.headers(headers_0))
		.pause(10)
    }

	object FinderTrips {
        val findTrips = exec(http("GET TRIPS")
			.get("api/v1/trips/?minDate=2024-04-06")
			.headers(headers_0))
		.pause(3)
    }

	object Login {
		val login = 
			feed(credentials)
			.exec(http("LOGIN EXPLORER")
				.post("api/v1/actors/login")
				.body(StringBody(session => s"""{ "email": "${session("email").as[String]}", "password": "${session("password").as[String]}" }"""))
				.headers(headers_0))
		.pause(2)
	}

	object ChangeComment{
		val changeComment = exec(http("CHANGE APPLICATION COMMENT")	
			.patch("/api/v1/applications/63f744014951bc47d4506660/change-comment")
			.body(RawFileBody("application.json"))
			.headers(headers_0))
		.pause(1)
	}

	object AddManager {
		val addManagers = 
			exec(http("POST ACTOR-MANAGER")
				.post("api/v1/actors")
				.body(RawFileBody("manager.json"))
				.headers(headers_0))
			.pause(3)
	}

	object GetDashboard {
		val dashboard = exec(http("GET DASHBOARD")
			.get("api/v1/dashboard/latest")
			.headers(headers_0))
		.pause(1)
	}

	object ChangeConfiguration {
		val configuration = exec(http("PUT CONFIGURATION")
			.put("api/v1/configurations/63ef50fea06dbef16f6193e6")
			.body(RawFileBody("configuration.json"))
			.headers(headers_0))
		.pause(2)
	}

	object Cube {
		val cube = exec(http("CUBE")
			.post("api/v1/dashboard/amount-spent-by-explorer")
			.body(RawFileBody("cube.json"))
			.headers(headers_0))
		.pause(1)
	}

    val adminsScn = scenario("Administration").exec(AddManager.addManagers,
													GetDashboard.dashboard,
													ChangeConfiguration.configuration,
													Cube.cube)

    val explorerScn = scenario("Explorer").exec(AddExplorer.addExplorers,
									  FinderTrips.findTrips,
									  Login.login,
									  ChangeComment.changeComment)
							
	

    setUp(
		explorerScn.inject(rampUsers(13500) during (100 seconds)),
		adminsScn.inject(rampUsers(13500) during (100 seconds)),
	).protocols(httpProtocol)
     .assertions(
        global.responseTime.max.lt(5000),    
        global.responseTime.mean.lt(1000),
        global.successfulRequests.percent.gt(85),
		forAll.failedRequests.percent.lte(20)
     )
}