package eu.city4age.dashboard.api.model;

// default package
// Generated 24-Nov-2016 15:43:47 by Hibernate Tools 5.2.0.Beta1

import java.util.HashSet;
import java.util.Set;

/**
 * CdDetectionVariableType generated by hbm2java
 */
public class CdDetectionVariableType extends AbstractBaseEntity {

	private String detectionVariableType;
	private String detectionVariableTypeDescription;
	private Set assessedSets = new HashSet(0);

	public CdDetectionVariableType() {
	}

	public CdDetectionVariableType(String detectionVariableType) {
		this.detectionVariableType = detectionVariableType;
	}

	public CdDetectionVariableType(String detectionVariableType, String detectionVariableTypeDescription,
			Set assessedSets) {
		this.detectionVariableType = detectionVariableType;
		this.detectionVariableTypeDescription = detectionVariableTypeDescription;
		this.assessedSets = assessedSets;
	}

	public String getDetectionVariableType() {
		return this.detectionVariableType;
	}

	public void setDetectionVariableType(String detectionVariableType) {
		this.detectionVariableType = detectionVariableType;
	}

	public String getDetectionVariableTypeDescription() {
		return this.detectionVariableTypeDescription;
	}

	public void setDetectionVariableTypeDescription(String detectionVariableTypeDescription) {
		this.detectionVariableTypeDescription = detectionVariableTypeDescription;
	}

	public Set getAssessedSets() {
		return this.assessedSets;
	}

	public void setAssessedSets(Set assessedSets) {
		this.assessedSets = assessedSets;
	}

}