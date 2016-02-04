package com.dal.www.api

import com.dal.www.model.DoubleAgent
import com.dal.www.service.DoubleAgentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

/**
 * Created by Matt on 1/29/16.
 */

@RestController
public class DoubleAgentController {

  @Autowired
  private DoubleAgentService doubleAgentService

  @RequestMapping(
      value = "/api/doubleAgents",
      method = RequestMethod.GET,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Collection<DoubleAgent>> getDoubleAgents() {

    Collection<DoubleAgent> doubleAgents = doubleAgentService.findAll()

    return new ResponseEntity<Collection<DoubleAgent>>(doubleAgents, HttpStatus.OK)

  }

  @RequestMapping(
      value = "/api/doubleAgents/{id}",
      method = RequestMethod.GET,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<DoubleAgent> getDoubleAgent(@PathVariable("id") Long id) {

    DoubleAgent doubleAgent = doubleAgentService.findOne(id)

    if(!doubleAgent) return new ResponseEntity<DoubleAgent>(HttpStatus.NOT_FOUND)

    return new ResponseEntity<DoubleAgent>(doubleAgent, HttpStatus.OK)

  }

  @RequestMapping(
      value = "/api/doubleAgents",
      method = RequestMethod.POST,
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<DoubleAgent> createDoubleAgent(@RequestBody DoubleAgent doubleAgent) {

    DoubleAgent newDoubleAgent = doubleAgentService.create(doubleAgent)

    return new ResponseEntity<DoubleAgent>(newDoubleAgent, HttpStatus.CREATED)

  }

  @RequestMapping(
      value="/api/doubleAgents/{id}",
      method=RequestMethod.PUT,
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces=MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<DoubleAgent> updateDoubleAgent(@RequestBody DoubleAgent doubleAgent) {

    DoubleAgent updatedDoubleAgent = doubleAgentService.update(doubleAgent)

    if(!updatedDoubleAgent) return new ResponseEntity<DoubleAgent>(HttpStatus.INTERNAL_SERVER_ERROR)

    return new ResponseEntity<DoubleAgent>(updatedDoubleAgent, HttpStatus.OK)

  }

  @RequestMapping(
      value="/api/doubleAgents/{id}",
      method=RequestMethod.DELETE)
  public ResponseEntity<DoubleAgent> deleteDoubleAgent(@PathVariable("id") Long id) {

    doubleAgentService.delete(id)

    return new ResponseEntity<DoubleAgent>(HttpStatus.NO_CONTENT)

  }

}