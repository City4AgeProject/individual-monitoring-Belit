package eu.city4age.dashboard.api.model;

import java.io.Serializable;

import javax.persistence.Embeddable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

// default package
// Generated 24-Nov-2016 15:43:47 by Hibernate Tools 5.2.0.Beta1

/**
 * AssessedGefValueSet generated by hbm2java
 */
@Embeddable
public class AssessedGefValueSet implements Serializable {

	private AssessedGefValueSetId assessedGefValueSetId;

	private Assessment assessment;
	
	private GeriatricFactorValue geriatricFactorValue;

	public AssessedGefValueSet() {
	}

	public AssessedGefValueSet(Assessment assessment, GeriatricFactorValue geriatricFactorValue) {
		this.assessment = assessment;
		this.geriatricFactorValue = geriatricFactorValue;
		this.geriatricFactorValue.addAssessment(assessment);
	}

	public AssessedGefValueSetId getAssessedGefValueSetId() {
		return assessedGefValueSetId;
	}

	public void setAssessedGefValueSetId(AssessedGefValueSetId assessedGefValueSetId) {
		this.assessedGefValueSetId = assessedGefValueSetId;
	}

	public Assessment getAssessment() {
		return this.assessment;
	}

	public void setAssessment(Assessment assessment) {
		this.assessment = assessment;
		if(this.geriatricFactorValue != null)
			this.geriatricFactorValue.addAssessment(assessment);
	}

	public GeriatricFactorValue getGeriatricFactorValue() {
		return geriatricFactorValue;
	}

	public void setGeriatricFactorValue(GeriatricFactorValue geriatricFactorValue) {
		this.geriatricFactorValue = geriatricFactorValue;
		if(this.assessment != null)
			this.geriatricFactorValue.addAssessment(this.assessment);
	}

}
