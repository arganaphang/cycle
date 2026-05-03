package repository

import (
	"context"
	"fmt"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type StaffRepository interface {
	Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Staff, []error)
	LoaderByUserIDs(ctx context.Context, userIDs []uuid.UUID) ([]*model.Staff, []error)
	FindAll(ctx context.Context, search *string, limit *int32, offset *int32, sortBy *model.StaffSortField, sortOrder *model.SortOrder) ([]*entity.Staff, *int32, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Staff, error)
	Create(ctx context.Context, input model.CreateStaffInput) (*entity.Staff, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*entity.Staff, error)
}

type staffRepository struct {
	db *sqlx.DB
}

func NewStaffRepository(db *sqlx.DB) StaffRepository {
	return &staffRepository{db: db}
}

// Create implements [StaffRepository].
func (s *staffRepository) Create(ctx context.Context, input model.CreateStaffInput) (*entity.Staff, error) {
	stmt := goqu.Insert(entity.TABLE_STAFF).
		Rows(goqu.Record{
			"user_id":        input.UserID,
			"full_name":      input.FullName,
			"specialization": input.Specialization,
			"license_no":     input.LicenseNo,
			"phone":          input.Phone,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	staff := entity.Staff{}
	if err := s.db.Get(&staff, sql); err != nil {
		return nil, err
	}
	return &staff, nil
}

// Loader implements [StaffRepository].
func (s *staffRepository) Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Staff, []error) {
	stmt := goqu.From(entity.TABLE_STAFF)
	sql, _, _ := stmt.Where(goqu.C("id").In(IDs)).ToSQL()
	results := []*entity.Staff{}
	if err := s.db.Select(&results, sql); err != nil {
		errors := make([]error, len(IDs))
		for idx := range errors {
			errors[idx] = err
		}
		return nil, errors
	}

	staffByID := make(map[uuid.UUID]*model.Staff, len(results))
	for _, result := range results {
		staffByID[result.ID] = result.ToModel()
	}

	staffs := make([]*model.Staff, len(IDs))
	errors := make([]error, len(IDs))
	for idx, id := range IDs {
		staff, ok := staffByID[id]
		if !ok {
			errors[idx] = fmt.Errorf("staff not found: %s", id)
			continue
		}
		staffs[idx] = staff
	}
	return staffs, errors
}

// LoaderByUserID implements [StaffRepository].
func (s *staffRepository) LoaderByUserIDs(ctx context.Context, userIDs []uuid.UUID) ([]*model.Staff, []error) {
	stmt := goqu.From(entity.TABLE_STAFF)
	sql, _, _ := stmt.Where(goqu.C("user_id").In(userIDs)).ToSQL()
	results := []*entity.Staff{}
	if err := s.db.Select(&results, sql); err != nil {
		errors := make([]error, len(userIDs))
		for idx := range errors {
			errors[idx] = err
		}
		return nil, errors
	}

	staffByUserID := make(map[uuid.UUID]*model.Staff, len(results))
	for _, result := range results {
		staffByUserID[result.UserID] = result.ToModel()
	}

	staffs := make([]*model.Staff, len(userIDs))
	for idx, userID := range userIDs {
		staffs[idx] = staffByUserID[userID]
	}
	return staffs, nil
}

// FindAll implements [StaffRepository].
func (s *staffRepository) FindAll(ctx context.Context, search *string, limit *int32, offset *int32, sortBy *model.StaffSortField, sortOrder *model.SortOrder) ([]*entity.Staff, *int32, error) {
	limitFilter := uint(20)
	offsetFilter := uint(0)
	if limit != nil {
		limitFilter = uint(*limit)
	}
	if offset != nil {
		offsetFilter = uint(*offset)
	}
	stmt := goqu.From(goqu.T(entity.TABLE_STAFF).As("s"))

	if search != nil {
		stmt = stmt.Where(goqu.I("s.full_name").ILike(fmt.Sprintf("%s%%", *search)))
	}

	field := model.StaffSortFieldCreatedAt
	if sortBy != nil {
		field = *sortBy
	}
	asc := sortOrder != nil && *sortOrder == model.SortOrderAsc

	orderIdent := goqu.I("s.created_at")
	switch field {
	case model.StaffSortFieldEmail:
		stmt = stmt.LeftJoin(
			goqu.T(entity.TABLE_USER).As("u"),
			goqu.On(goqu.I("s.user_id").Eq(goqu.I("u.id"))),
		)
		orderIdent = goqu.I("u.email")
	case model.StaffSortFieldFullName:
		orderIdent = goqu.I("s.full_name")
	case model.StaffSortFieldLicenseNo:
		orderIdent = goqu.I("s.license_no")
	case model.StaffSortFieldPhone:
		orderIdent = goqu.I("s.phone")
	case model.StaffSortFieldSpecialization:
		orderIdent = goqu.I("s.specialization")
	default:
		orderIdent = goqu.I("s.created_at")
	}
	if asc {
		stmt = stmt.Order(orderIdent.Asc())
	} else {
		stmt = stmt.Order(orderIdent.Desc())
	}

	sql, _, _ := stmt.Select(goqu.L("s.*")).Limit(limitFilter).Offset(offsetFilter).ToSQL()
	staffs := []*entity.Staff{}
	if err := s.db.Select(&staffs, sql); err != nil {
		return nil, nil, err
	}
	sqlCount, _, err := stmt.ClearOrder().Select(goqu.COUNT(goqu.L("*"))).ToSQL()
	if err != nil {
		return nil, nil, err
	}

	var count int32
	if err := s.db.Get(&count, sqlCount); err != nil {
		return nil, nil, err
	}
	return staffs, &count, nil
}

// FindByID implements [StaffRepository].
func (s *staffRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Staff, error) {
	sql, _, _ := goqu.From(entity.TABLE_STAFF).Where(goqu.C("id").Eq(id)).ToSQL()
	staff := entity.Staff{}
	if err := s.db.Get(&staff, sql); err != nil {
		return nil, err
	}
	return &staff, nil
}

// Update implements [StaffRepository].
func (s *staffRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*entity.Staff, error) {
	records := goqu.Record{}
	if input.FullName != nil {
		records["full_name"] = *input.FullName
	}
	if input.Specialization != nil {
		records["specialization"] = *input.Specialization
	}
	if input.LicenseNo != nil {
		records["license_no"] = *input.LicenseNo
	}
	if input.Phone != nil {
		records["phone"] = *input.Phone
	}
	sql, _, err := goqu.Update(entity.TABLE_STAFF).
		Set(records).
		Where(goqu.C("id").Eq(id)).
		Returning("*").
		ToSQL()
	if err != nil {
		return nil, err
	}
	staff := entity.Staff{}
	if err := s.db.Get(&staff, sql); err != nil {
		return nil, err
	}
	return &staff, nil
}
