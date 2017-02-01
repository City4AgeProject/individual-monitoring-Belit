package eu.city4age.dashboard.api.persist;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import eu.city4age.dashboard.api.persist.generic.GenericRepository;
import eu.city4age.dashboard.api.pojo.domain.GeriatricFactorValue;

@Repository(value = "geriatricFactorRepository")
@Transactional(readOnly = true)
public interface GeriatricFactorRepository extends GenericRepository<GeriatricFactorValue, Long> {

	@Query("SELECT g FROM GeriatricFactorValue g JOIN g.gefTypeId detvar WHERE detvar.derivedDetectionVariableId.id = :varId AND g.userInRole.id = :userId ORDER BY g.timeInterval.intervalStart ASC")
	List<GeriatricFactorValue> findByDetectionVariableId(@Param("varId") final Long dvId,
			@Param("userId") final Long uId);

}