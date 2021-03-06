package eu.city4age.dashboard.api.jpa;

import org.springframework.stereotype.Repository;

import eu.city4age.dashboard.api.jpa.generic.GenericRepository;
import eu.city4age.dashboard.api.pojo.domain.TypicalPeriod;

@Repository(value = "typicalPeriodRepository")
public interface TypicalPeriodRepository extends GenericRepository<TypicalPeriod, Long> {}