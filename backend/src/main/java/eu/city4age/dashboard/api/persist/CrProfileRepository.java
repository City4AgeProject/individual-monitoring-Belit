package eu.city4age.dashboard.api.persist;

import org.springframework.stereotype.Repository;

import eu.city4age.dashboard.api.persist.generic.GenericRepository;
import eu.city4age.dashboard.api.pojo.domain.CrProfile;

@Repository(value = "crProfileRepository")
public interface CrProfileRepository extends GenericRepository<CrProfile, Long> {}
