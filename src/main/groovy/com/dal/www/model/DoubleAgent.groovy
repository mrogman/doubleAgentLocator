package com.dal.www.model

/**
 * Created by Matt on 1/29/16.
 */

public class DoubleAgent {

  Long id
  String name
  Integer age
  String gender //M or F
  Double latitude
  Double longitude

  //property constants
  static final String NAME = "name"
  static final String LATITUDE = "latitude"
  static final String LONGITUDE = "longitude"
  static final String AGE = "age"
  static final String GENDER = "gender"

  public DoubleAgent() { }

  public DoubleAgent(String name, Integer age, String gender,
                     Double latitude, Double longitude) {
    this.name = name
    this.age = age
    this.gender = gender
    this.latitude = latitude
    this.longitude = longitude
  }

  public DoubleAgent(Map<String,String> agentProperties) {
    this.name = agentProperties[NAME]
    this.latitude = Double.parseDouble(agentProperties[LATITUDE])
    this.longitude = Double.parseDouble(agentProperties[LONGITUDE])
    this.age = Integer.parseInt(agentProperties[AGE])
    this.gender = agentProperties[GENDER]
  }

}