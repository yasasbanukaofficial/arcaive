package tech.yasasbanuka.backend.dto.job;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class JobResponseDTO {
    private String jobId;
    private String jobTitle;
    private String employerName;
    private String employerLogo;
    private String employerWebsite;
    private String jobPublisher;
    private String jobEmploymentType;
    private List<String> jobEmploymentTypes;
    private String jobApplyLink;
    private Boolean jobApplyIsDirect;
    private List<ApplyOptionDTO> applyOptions;
    private String jobDescription;
    private Boolean jobIsRemote;
    private String jobPostedAt;
    private Long jobPostedAtTimestamp;
    private String jobPostedAtDatetimeUtc;
    private String jobLocation;
    private String jobCity;
    private String jobState;
    private String jobCountry;
    private Double jobLatitude;
    private Double jobLongitude;
    private List<String> jobBenefits;
    private String jobGoogleLink;
    private String jobSalary;
    private Double jobMinSalary;
    private Double jobMaxSalary;
    private String jobSalaryPeriod;
    private Map<String, Object> jobHighlights;
    private String jobOnetSoc;
    private String jobOnetJobZone;
}
