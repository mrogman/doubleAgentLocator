package com.dal.www.service

import com.dal.www.model.DoubleAgent

/**
 * Created by Matt on 1/29/16.
 */

public interface DoubleAgentService {

  Collection<DoubleAgent> findAll()

  DoubleAgent findOne(Long id)

  DoubleAgent create(DoubleAgent doubleAgent)

  DoubleAgent update(DoubleAgent doubleAgent)

  void delete(Long id)

}