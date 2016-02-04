package com.dal.www.service

import com.dal.www.model.DoubleAgent
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVRecord
import org.springframework.stereotype.Service

import java.text.ParseException

import org.apache.commons.csv.CSVParser


/**
 * Created by Matt on 1/29/16.
 */

@Service
public class DoubleAgentServiceBean implements DoubleAgentService {

  private static Long nextId
  private static Map<Long, DoubleAgent> doubleAgentMap

  private static DoubleAgent save(DoubleAgent doubleAgent) {
    doubleAgent.id = nextId
    nextId += 1L
    doubleAgentMap << [(doubleAgent.id):doubleAgent]
    return doubleAgent
  }

  private static void remove(DoubleAgent doubleAgent) {
    doubleAgentMap.remove(doubleAgent.id)
  }

  private static void loadAgentData(File csv) {
    Reader reader
    CSVFormat format
    CSVParser csvParser
    List records

    final String[] FILE_HEADER_MAPPING = [DoubleAgent.NAME, DoubleAgent.LATITUDE,
                                          DoubleAgent.LONGITUDE, DoubleAgent.AGE,
                                          DoubleAgent.GENDER]

    try {
      reader = new FileReader(csv);
      format = CSVFormat.DEFAULT.withHeader(FILE_HEADER_MAPPING)
      csvParser = new CSVParser(reader, format)
      records = csvParser.getRecords()
      records.each { CSVRecord record ->
        Map<String, String> agentProps = [:]
        FILE_HEADER_MAPPING.each { agentProps << [(it): record.get(it)] }
        DoubleAgent doubleAgent = new DoubleAgent(agentProps)
        println doubleAgent
        save(doubleAgent)
      }
    }
    catch(Exception e) {
      println "Error converting csv records to DoubleAgent objects"
      e.printStackTrace()
    }
    finally {
      try {
        reader.close()
        csvParser.close()
      } catch(IOException e) {
        println "Error while closing CSVParser and FileReader"
        e.printStackTrace()
      }
    }
  }

  static {
    doubleAgentMap = doubleAgentMap ?: [:]
    nextId = nextId ?: 1L

    File doubleAgentCsv = new File("cc-maps-data-set.csv") //TODO: Remove hardcoding
    loadAgentData(doubleAgentCsv)
  }

  @Override
  Collection<DoubleAgent> findAll() {
    return doubleAgentMap.values()
  }

  @Override
  DoubleAgent findOne(Long id) {
    DoubleAgent doubleAgent = doubleAgentMap[id]
    return doubleAgent
  }

  @Override
  DoubleAgent create(DoubleAgent doubleAgent) {
    return save(doubleAgent)
  }

  @Override
  DoubleAgent update(DoubleAgent doubleAgent) {
    return save(doubleAgent)
  }

  @Override
  void delete(Long id) {
    remove(doubleAgentMap.get(id))
  }

}
