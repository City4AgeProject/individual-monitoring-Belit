package eu.city4age.dashboard.api.model;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Transient;

// default package
// Generated 24-Nov-2016 15:43:47 by Hibernate Tools 5.2.0.Beta1

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * GeriatricFactorValue generated by hbm2java
 */
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="id")
public class GeriatricFactorValue extends AbstractBaseEntity {

	private BigDecimal gefValue;
	
	private TimeInterval timeInterval;
	
	private CdDetectionVariable cdDetectionVariable;
	private UserInRole userInRole;
	private String dataSourceType;
	
	private BigDecimal derivationWeight;

	private Set sourceEvidences = new HashSet(0);
	
	private Set<NumericIndicatorValue> numericIndicatorValues = new HashSet<NumericIndicatorValue>();

	private Set<AssessedGefValueSet> assessedGefValueSets = new HashSet<AssessedGefValueSet>();
	
	@Transient
	private Set<Assessment> assessments = new HashSet<Assessment>();

	public GeriatricFactorValue() {
	}

	public GeriatricFactorValue(BigDecimal gefValue, TimeInterval timeInterval, CdDetectionVariable cdDetectionVariable, UserInRole userInRole,
			String dataSourceType, Set<AssessedGefValueSet> assessedGefValueSets, Set nuiGefs, Set sourceEvidences) {
		this.gefValue = gefValue;
		this.timeInterval = timeInterval;
		this.cdDetectionVariable = cdDetectionVariable;
		this.userInRole = userInRole;
		this.dataSourceType = dataSourceType;
		this.assessedGefValueSets = assessedGefValueSets;
		this.sourceEvidences = sourceEvidences;
	}

	public BigDecimal getGefValue() {
		return this.gefValue;
	}

	public void setGefValue(BigDecimal gefValue) {
		this.gefValue = gefValue;
	}


	public TimeInterval getTimeInterval() {
		return timeInterval;
	}

	public void setTimeInterval(TimeInterval timeInterval) {
		this.timeInterval = timeInterval;
	}

	public CdDetectionVariable getCdDetectionVariable() {
		return cdDetectionVariable;
	}

	public void setCdDetectionVariable(CdDetectionVariable cdDetectionVariable) {
		this.cdDetectionVariable = cdDetectionVariable;
	}

	public UserInRole getUserInRole() {
		return userInRole;
	}

	public void setUserInRole(UserInRole userInRole) {
		this.userInRole = userInRole;
	}

	public String getDataSourceType() {
		return this.dataSourceType;
	}

	public void setDataSourceType(String dataSourceType) {
		this.dataSourceType = dataSourceType;
	}

	public BigDecimal getDerivationWeight() {
		return derivationWeight;
	}

	public void setDerivationWeight(BigDecimal derivationWeight) {
		this.derivationWeight = derivationWeight;
	}

	public Set getSourceEvidences() {
		return this.sourceEvidences;
	}

	public void setSourceEvidences(Set sourceEvidences) {
		this.sourceEvidences = sourceEvidences;
	}

	public Set<NumericIndicatorValue> getNumericIndicatorValues() {
		return numericIndicatorValues;
	}

	public void setNumericIndicatorValues(Set<NumericIndicatorValue> numericIndicatorValues) {
		this.numericIndicatorValues = numericIndicatorValues;
	}

	public Set<AssessedGefValueSet> getAssessedGefValueSets() {
		return assessedGefValueSets;
	}

	public void setAssessedGefValueSets(Set<AssessedGefValueSet> assessedGefValueSets) {
		this.assessedGefValueSets = assessedGefValueSets;
	}
	
	public Set<Assessment> getAssessments() {
		return assessments;
	}

	public void setAssessments(Set<Assessment> assessments) {
		this.assessments = assessments;
	}

	public void addAssessment(Assessment assessment) {
		this.assessments.add(assessment);
	}

	public CdDetectionVariable getGefTypeId() {
		return this.cdDetectionVariable;
	}

	public TimeInterval getTimeIntervalId() {
		return this.timeInterval;
	}

}
