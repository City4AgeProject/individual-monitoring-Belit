package eu.city4age.dashboard.api.persist;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import eu.city4age.dashboard.api.persist.generic.GenericRepository;
import eu.city4age.dashboard.api.pojo.domain.VariationMeasureValue;
import eu.city4age.dashboard.api.pojo.dto.Nuis;

@Repository(value = "variationMeasureValueRepository")
@Transactional(readOnly = true)
public interface VariationMeasureValueRepository extends GenericRepository<VariationMeasureValue, Long> {
	
	
	@Query("SELECT vm FROM VariationMeasureValue vm INNER JOIN FETCH vm.detectionVariable dv LEFT JOIN FETCH vm.timeInterval ti WHERE vm.detectionVariable.id IN (SELECT pdv.detectionVariable.id FROM PilotDetectionVariable pdv INNER JOIN pdv.detectionVariable dv WHERE pdv.derivedDetectionVariable.id = :gesId AND dv.detectionVariableType = 'MEA') AND vm.userInRole.id = :uId ORDER BY ti.intervalStart")				
	List<VariationMeasureValue> findByUserAndGes(@Param("uId") final Long uId, @Param("gesId") final Long gesId);

	@Query("SELECT vm FROM VariationMeasureValue vm LEFT JOIN vm.timeInterval ti WHERE (ti.intervalStart >= :intervalStart OR (ti.intervalEnd IS NULL OR ti.intervalEnd >= :intervalStart)) AND (ti.intervalStart <= :intervalEnd OR (ti.intervalEnd IS NULL OR ti.intervalEnd <= :intervalEnd)) AND (ti.typicalPeriod IS NULL OR ti.typicalPeriod = 'DAY' OR ti.typicalPeriod = '1WK')")
	List<VariationMeasureValue> findAllForMonthByPilotCodeNui(@Param("intervalStart") final Timestamp intervalStart, @Param("intervalEnd") final Timestamp intervalEnd);

	@Query(nativeQuery = true)
	List<Nuis> doAllNuis(@Param("startOfMonth") Timestamp startOfMonth, @Param("endOfMonth") Timestamp endOfMonth);

}